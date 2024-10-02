import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getUpdateObjectByAction } from '../../common/action-update';
import { ChangePasswordDto, PasswordDto, UsernameDto } from './dto/update.dto';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../supporting-modules/notification/notification.service';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

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
    const [users, count]: any = await this.userRepository.findAndCount({
      where: { deleteFlag: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    let result: any = users.map((user: User) => {
      return {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        cover: user.cover,
        dob: user.dob,
        status: user.status,
        verified: user.verified,
        ssoLogin: user.ssoLogin,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt,
        modifiedAt: user.modifiedAt,
      };
    });

    return { result, count };
  }

  async getById(id: string, selfId: string) {
    let user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      cover: user.cover,
      bio: user.bio,
      dob: user.dob,
      status: user.status,
      verified: user.verified,
      ssoLogin: user.ssoLogin,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
      modifiedAt: user.modifiedAt,
    };
  }

  async getByUsername(username: string, selfId: string) {
    let user = await this.userRepository.findOne({
      where: { username }
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      cover: user.cover,
      bio: user.bio,
      dob: user.dob,
      status: user.status,
      verified: user.verified,
      ssoLogin: user.ssoLogin,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
      modifiedAt: user.modifiedAt,
    };
  }

  async updateById(id: string, user: any) {
    let result = await this.userRepository.update(id, user);
    if (result) {
      this.sendPushNotification(
        id,
        'update',
        'Profile update',
        'Your Profile have been updated successfully',
      );
    }
    return result;
    // let data = await this.userRepository.findOneBy({ id });
    // delete data.password;
    // return data;
  }

  async updateActionById(id: string, action: string) {
    return await this.userRepository.update(
      id,
      getUpdateObjectByAction(action),
    );
  }

  async setPassword(id: string, passwordDto: PasswordDto) {
    let password = await bcrypt.hash(passwordDto.password, 8);
    let result = await this.userRepository.update(id, { password });
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

  async checkUsername(usernameDto: UsernameDto, selfId: string) {
    if (!usernameDto.username) return false;
    let userDetails = await this.userRepository.findOne({
      where: { id: selfId, deleteFlag: false },
    });
    let username = await this.userRepository.findOne({
      where: { username: usernameDto.username, deleteFlag: false },
    });
    if (username) {
      return userDetails.username === username.username ? true : false;
    } else {
      return true;
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    let userDetails = await this.userRepository.findOne({
      where: { id, deleteFlag: false },
    });
    if (!userDetails) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Tweet with such id not found',
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
    let result = await this.userRepository.update(userDetails.id, { password });
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

}
