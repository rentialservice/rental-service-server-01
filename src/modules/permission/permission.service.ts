import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUpdateObjectByAction } from '../../common/action-update';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    ) { }

    async create(createObject: Partial<Permission>): Promise<any> {
        const result = this.permissionRepository.create(createObject);
        return await this.permissionRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.permissionRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const permission = await this.permissionRepository.findOne({ where: { id, deleteFlag: false } });
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        return permission;
    }

    async update(id: string, updateObject: Partial<Permission>, filterType?: string): Promise<any> {
        return await this.permissionRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.permissionRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.permissionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        return result;
    }
}