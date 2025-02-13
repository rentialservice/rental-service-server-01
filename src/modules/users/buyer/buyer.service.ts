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
import { Buyer } from './entities/buyer.entity';
import { SelectConstants } from '../../../constants/select.constant';
import { buildFilterCriteriaQuery } from '../../../common/utils';
import { CommonService } from '../../common/common.service';
import { S3Service } from '../../supporting-modules/s3/s3.service';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer) private readonly repository: Repository<Buyer>,
    private readonly notificationService: NotificationService,
    private readonly commonService: CommonService,
    private readonly s3Service: S3Service,
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

  async create(
    createObject: any,
    queryData: any,
    documents?: any[],
  ): Promise<any> {
    if (documents) {
      createObject.documents = [];
      await Promise.all(
        documents.map(async (m) => {
          let fileURL = await this.s3Service.uploadImageS3(
            m,
            process.env.PRODUCT_MEDIA_FOLDER_NAME as string,
          );
          createObject.documents.push(fileURL);
        }),
      );
    }
    if (!queryData?.firm) {
      throw new Error('Firm is required');
    }
    let [firm] = await this.commonService.firmFilter({
      id: queryData.firm,
    });
    if (!firm) {
      throw new NotFoundException(`Firm with id ${queryData.firm} not found`);
    } else {
      createObject.firm = firm;
    }
    const result = this.repository.create(createObject);
    return await this.repository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
    filterCriteria?: any,
  ): Promise<any> {
    if (!filterCriteria?.firm) {
      throw new Error('Firm is required');
    }
    delete filterCriteria?.category;
    return await this.repository.findAndCount({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: SelectConstants.BUYER_SELECT,
    });
  }

  async getById(id: string, selfId: string) {
    return await this.repository.findOne({
      where: { id },
      select: SelectConstants.BUYER_SELECT,
    });
  }

  async getByUsername(username: string, selfId: string) {
    return await this.repository.findOne({
      where: { username },
      select: SelectConstants.BUYER_SELECT,
    });
  }

  async updateById(id: string, user: any, documents?: any[]) {
    if (documents) {
      user.documents = [];
      await Promise.all(
        documents.map(async (m) => {
          let fileURL = await this.s3Service.uploadImageS3(
            m,
            process.env.PRODUCT_MEDIA_FOLDER_NAME as string,
          );
          user.documents.push(fileURL);
        }),
      );
    }
    if (user?.role) {
      let [role] = await this.commonService.roleFilter({ name: user?.role });
      if (!role) {
        throw new NotFoundException('Given Role is not exist');
      }
      user.role = role;
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

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.repository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }

  async delete(id: string, filterType?: string): Promise<any> {
    let [buyer] = await this.commonService.rentalFilter({
      buyer: { id },
    });
    if (buyer) {
      throw new Error("Buyer can't be deleted");
    }
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Buyer with id ${id} not found`);
    }
    return result;
  }
}
