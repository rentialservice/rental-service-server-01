import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { Rental } from './entities/rental.entity';
import { Request, Response } from 'express';
import { RoutesConstants } from '../../constants/routes.constant';
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from '../../base/response';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createObject: Partial<Rental>,
  ): Promise<void> {
    try {
      let result = await this.rentalService.create(createObject, request.query);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post('/filter')
  async getFilter(
    @Req() request: Request,
    @Res() response: Response,
    @Body() filterCriteria: any,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.rentalService.filter(
        filterCriteria,
        [],
        filterType,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/invoice/download')
  async createInvoiceDownload(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const pdfStream = await this.rentalService.createInvoice(id, filterType);
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="invoice-${id}.pdf"`,
      );
      pdfStream.pipe(response);
      pdfStream.on('end', () => {
        console.log('PDF stream finished');
      });
      pdfStream.on('error', (error) => {
        console.error('PDF stream error:', error);
        response.status(500).send('Error streaming PDF');
      });
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/invoice/preview')
  async createInvoicePreview(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result = await this.rentalService.createInvoicePreview(
        id,
        filterType,
      );
      response.send(result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get()
  async getAll(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.PAGE) page: number = 1,
    @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const [result, count]: any = await this.rentalService.getAll(
        page,
        pageSize,
        filterType,
        request.query,
      );
      successPaginatedResponse(response, result, count, page, pageSize);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get(RoutesConstants.PARAM_ID)
  async getById(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.rentalService.getById(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Put(RoutesConstants.PARAM_ID)
  async update(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Body() updateObject: Partial<Rental>,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.rentalService.update(
        id,
        updateObject,
        filterType,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Delete(RoutesConstants.PARAM_ID)
  async delete(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.rentalService.delete(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post('/filter')
  async filter(
    @Req() request: Request,
    @Res() response: Response,
    @Body() filterCriteria: any,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.rentalService.filter(
        filterCriteria,
        [],
        filterType,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
