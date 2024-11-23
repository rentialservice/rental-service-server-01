import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../../supporting-modules/notification/notification.service';
import { Seller } from './entities/seller.entity';
import { SelectConstants } from '../../../constants/select.constant';
import { RoleService } from '../../role/role.service';


@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller) private readonly repository: Repository<Seller>,
    private readonly notificationService: NotificationService,
    private readonly roleService: RoleService,
  ) { }

  async sendPushNotification(
    id: string,
    notificationType: string,
    title: string,
    message: string,
    data?: any,
  ) {
    try {
      await this.notificationService.sendPush(
        id,
        notificationType,
        title,
        message,
        data,
      );
    } catch (e) {
      console.log('Error sending push notification', e);
      throw e;
    }
  }

  async getAll(page: number = 1, pageSize: number = 10): Promise<any> {
    return await this.repository.findAndCount({
      where: { deleteFlag: false },
      relations: ["role", "firm"],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: SelectConstants.SELLER_SELECT,
    });
  }

  async getById(id: string, selfId: string) {
    return await this.repository.findOne({
      where: { id },
      relations: ["role", "firm"],
      select: SelectConstants.SELLER_SELECT,
    });
  }

  async getByUsername(username: string, selfId: string) {
    return await this.repository.findOne({
      where: { username },
      relations: ["role", "firm"],
      select: SelectConstants.SELLER_SELECT,
    });
  }

  async updateById(id: string, user: any) {
    if (user?.role) {
      let [role] = await this.roleService.filter({ name: user?.role })
      if (!role) {
        throw new NotFoundException("Given Role is not exist")
      }
      user.role = role
    }
    let result = await this.repository.update(id, user);
    if (result) {
      this.sendPushNotification(
        id,
        'update',
        'Profile update',
        'Your Profile have been updated successfully',
      );
    }
    return result;
    // let data = await this.repository.findOneBy({ id });
    // delete data.password;
    // return data;
  }

  async setPassword(id: string, passwordDto: any) {
    let password = await bcrypt.hash(passwordDto.password, 8);
    let result = await this.repository.update(id, { password });
    if (result) {
      this.sendPushNotification(
        id,
        'update',
        'Password setting',
        'Your Password have been set successfully',
      );
    }
    return result;
  }

  async checkUsername(usernameDto: any, selfId: string) {
    if (!usernameDto.username) return false;
    let userDetails = await this.repository.findOne({
      where: { id: selfId, deleteFlag: false },
    });
    let username = await this.repository.findOne({
      where: { username: usernameDto.username, deleteFlag: false },
    });
    if (username) {
      return userDetails.username === username.username ? true : false;
    } else {
      return true;
    }
  }

  async changePassword(id: string, changePasswordDto: any) {
    let userDetails = await this.repository.findOne({
      where: { id, deleteFlag: false },
    });
    if (!userDetails) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with such id not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    let match = await bcrypt.compare(
      changePasswordDto.password,
      userDetails.password,
    );
    if (!match) throw new Error('Incorrect password');
    let password = await bcrypt.hash(changePasswordDto.password, 8);
    let result = await this.repository.update(userDetails.id, { password });
    if (result) {
      this.sendPushNotification(
        id,
        'update',
        'Password change',
        'Your Password have been updated successfully',
      );
    }
    return true;
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result;
  }

}
