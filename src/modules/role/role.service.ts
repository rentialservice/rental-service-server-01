import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { getUpdateObjectByAction } from '../../common/action-update';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        private readonly permissionService: PermissionService
    ) { }

    async create(createObject: any): Promise<any> {
        if (!createObject?.permissions?.length) {
            throw new Error("At least one permission is required to create any role")
        }
        createObject.permissions = await this.permissionService.filter({ id: createObject.permissions })
        const result = this.roleRepository.create(createObject);
        return await this.roleRepository.save(result);
    }

    async getAll(page: number = 1, pageSize: number = 10, filterType?: string): Promise<any> {
        return await this.roleRepository.findAndCount({
            where: { deleteFlag: false },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async getById(id: string, filterType?: string): Promise<any> {
        const role = await this.roleRepository.findOne({ where: { id, deleteFlag: false }, relations: ["permissions"] });
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }

    async update(id: string, updateObject: any, filterType?: string): Promise<any> {
        if (updateObject?.permissions?.length) {
            updateObject.permissions = await this.permissionService.filter({ id: updateObject.permissions })
        }
        return await this.roleRepository.update(id, updateObject);
    }

    async updateActionById(id: string, action: string, filterType?: string) {
        return await this.roleRepository.update(
            id,
            getUpdateObjectByAction(action),
        );
    }

    async delete(id: string, filterType?: string): Promise<any> {
        const result = await this.roleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return result;
    }
}