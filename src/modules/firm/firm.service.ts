import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Firm } from './entities/firm.entity';
import { getUpdateObjectByAction } from '../../common/action-update';

@Injectable()
export class FirmService {
    constructor(
        @InjectRepository(Firm) private readonly firmRepository: Repository<Firm>,
    ) { }

    async create(firmData: Partial<Firm>): Promise<any> {
        const firm = this.firmRepository.create(firmData);
        return await this.firmRepository.save(firm);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        const [result, count]: any = await this.firmRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return { result, count };
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const firm = await this.firmRepository.findOne({ where: { id, deleteFlag: false } });
        if (!firm) {
            throw new NotFoundException(`Firm with ID ${id} not found`);
        }
        return firm;
    }

    async update(id: string, updateData: Partial<Firm>, filterType?: string): Promise<any> {
        return await this.firmRepository.update(id, updateData);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.firmRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.firmRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Firm with ID ${id} not found`);
        }
        return result;
    }
}
