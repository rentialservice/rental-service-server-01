import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { buildFilterCriteriaQuery } from "../../common/utils";
import { CommonService } from "../common/common.service";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly commonService: CommonService,
  ) {}

  async create(createObject: any): Promise<any> {
    if (!createObject?.permissions?.length) {
      throw new NotAcceptableException("At least one permission is required");
    }
    createObject.permissions = await this.commonService.permissionFilter({
      name: createObject.permissions,
    });
    if (!createObject?.permissions?.length) {
      throw new NotFoundException("Given permission is not exist");
    }
    const result = this.roleRepository.create(createObject);
    return await this.roleRepository.save(result);
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10,
    filterType?: string,
  ): Promise<any> {
    return await this.roleRepository.findAndCount({
      where: { deleteFlag: false },
      relations: ["permissions"],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getById(id: string, filterType?: string): Promise<any> {
    const role = await this.roleRepository.findOne({
      where: { id, deleteFlag: false },
      relations: ["permissions"],
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(
    id: string,
    updateObject: any,
    filterType?: string,
  ): Promise<any> {
    if (updateObject?.permissions?.length) {
      updateObject.permissions = await this.commonService.permissionFilter({
        id: updateObject.permissions,
      });
    }
    return await this.roleRepository.update(id, updateObject);
  }

  async delete(id: string, filterType?: string): Promise<any> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return result;
  }

  async filter(
    filterCriteria: any,
    fields: string[] = [],
    filterType?: string,
  ): Promise<any> {
    return await this.roleRepository.find({
      where: { ...buildFilterCriteriaQuery(filterCriteria), deleteFlag: false },
      relations: [...fields],
    });
  }
}
