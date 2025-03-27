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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RoutesConstants } from '../../constants/routes.constant';
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from '../../base/response';
import { PaymentCollectionService } from './payment-collection.service';
import { PaymentCollection } from './entities/payment-collection.entity';

@Controller('payment-collection')
export class PaymentCollectionController {
  constructor(
    private readonly paymentCollectionService: PaymentCollectionService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createObject: Partial<PaymentCollection>,
  ): Promise<void> {
    try {
      let result = await this.paymentCollectionService.create(
        createObject,
        request.query,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/receipt/download')
  async createReceiptDownload(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const pdfStream = await this.paymentCollectionService.createReceipt(
        id,
        filterType,
      );
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="Receipt-${id}.pdf"`,
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

  @Get('/receipt/preview')
  async createReceiptPreview(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result = await this.paymentCollectionService.createReceiptPreview(
        id,
        filterType,
      );
      response.send(result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/get-by-rental/:rental')
  async getPaymentCollectionsByRentalId(
    @Req() request: Request,
    @Res() response: Response,
    @Param('rental') id: string,
  ): Promise<void> {
    try {
      let result =
        await this.paymentCollectionService.getPaymentCollectionsByRentalId(id);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/filter')
  async getFilter(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.paymentCollectionService.filter(
        request.query,
        [],
        filterType,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/get-amount-statistics')
  async getAmountStatistics(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any =
        await this.paymentCollectionService.getAmountStatistics(
          request.query,
          [],
          filterType,
        );
      successResponse(response, result);
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
      const [result, count]: any = await this.paymentCollectionService.getAll(
        page,
        pageSize,
        request.query as any,
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
      let result = await this.paymentCollectionService.getById(id, filterType);
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
    @Body() updateObject: Partial<PaymentCollection>,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.paymentCollectionService.update(
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
      let result = await this.paymentCollectionService.delete(id, filterType);
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
      const result: any = await this.paymentCollectionService.filter(
        filterCriteria,
        [],
        filterType,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/receipt/download')
  async createInvoiceDownload(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const pdfStream = await this.paymentCollectionService.createReceipt(
        id,
        filterType,
      );
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

  @Get('/receipt/preview')
  async createInvoicePreview(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result = await this.paymentCollectionService.createReceiptPreview(
        id,
        filterType,
      );
      response.send(result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
