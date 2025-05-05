import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  Res,
  Req,
} from "@nestjs/common";
import { DynamicService } from "./dynamic.service";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../base/response";

@Controller("dynamic")
export class DynamicController {
  constructor(private dynamicService: DynamicService) {}

  @Post("create-schema")
  async createSchema(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createSchemaDto: { entityName: string; schemaDefinition: object },
  ): Promise<void> {
    try {
      let result = await this.dynamicService.createSchema(
        createSchemaDto.entityName,
        createSchemaDto.schemaDefinition,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post("store-data/:schemaId")
  async storeData(
    @Req() request: Request,
    @Res() response: Response,
    @Param("schemaId") schemaId: string,
    @Body() data: object,
  ): Promise<void> {
    try {
      let result = await await this.dynamicService.storeData(schemaId, data);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get("get-data/:schemaId")
  async getData(
    @Req() request: Request,
    @Res() response: Response,
    @Param("schemaId") schemaId: string,
  ): Promise<void> {
    try {
      let result = await this.dynamicService.getData(schemaId);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Put("update-schema/:schemaId")
  async updateSchema(
    @Req() request: Request,
    @Res() response: Response,
    @Param("schemaId") schemaId: string,
    @Body() updateSchemaDto: { entityName?: string; schemaDefinition?: object },
  ): Promise<void> {
    try {
      let result = await this.dynamicService.updateSchema(
        schemaId,
        updateSchemaDto,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Put("update-data/:dataId")
  async updateData(
    @Req() request: Request,
    @Res() response: Response,
    @Param("dataId") dataId: string,
    @Body() data: object,
  ): Promise<void> {
    try {
      let result = await this.dynamicService.updateData(dataId, data);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Delete("delete-schema/:schemaId")
  async deleteSchema(
    @Req() request: Request,
    @Res() response: Response,
    @Param("schemaId") schemaId: string,
  ): Promise<void> {
    try {
      let result = await this.dynamicService.deleteSchema(schemaId);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Delete("delete-data/:dataId")
  async deleteData(
    @Req() request: Request,
    @Res() response: Response,
    @Param("dataId") dataId: string,
  ): Promise<void> {
    try {
      let result = await this.dynamicService.deleteData(dataId);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
