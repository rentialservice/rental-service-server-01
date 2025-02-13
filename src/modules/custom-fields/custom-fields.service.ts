import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomFields } from './entities/custom-fields.entity';
import { FirmService } from '../firm/firm.service';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    private readonly firmService: FirmService,
  ) {}

  async create(createObject: any): Promise<any> {
    if (!createObject?.module && !createObject?.firm) {
      throw new Error('Firm or Module is required');
    }
    if (createObject?.firm) {
      let [firm] = await this.firmService.filter({ id: createObject.firm });
      if (!firm) {
        throw new NotFoundException(
          `Firm with id ${createObject.firm} not found`,
        );
      } else {
        createObject.firm = firm;
      }
    }
    const result = this.customFieldsRepository.create(createObject);
    return await this.customFieldsRepository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
  ): Promise<any> {
    return await this.customFieldsRepository.findAndCount({
      where: { deleteFlag: false },
      relations: ['module', 'firm'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const result = await this.customFieldsRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ['module', 'firm'],
    });
    if (!result) {
      throw new NotFoundException(`Custom Feilds with id ${id} not found`);
    }
    return result;
  }

  async update(
    id: string,
    updateObject: any,
    filterType?: string,
  ): Promise<any> {
    return await this.customFieldsRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.customFieldsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Custom Fields with id ${id} not found`);
    }
    return result;
  }
}
