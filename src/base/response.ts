import { Response } from 'express';
import { SuccessConstants } from '../constants/success.constant';
import { ErrorConstants } from '../constants/error.constant';

export const successResponse = (
  response: Response,
  data: any,
  code?: number,
  message?: string,
) => {
  response.status(code || SuccessConstants.SUCCESSFULL).json({
    status: true,
    message: message || SuccessConstants.SUCCESSFULL_MESSAGE,
    data: data,
  });
};

export const successPaginatedResponse = (
  response: Response,
  data: any,
  totalCount: number,
  page: number,
  pageSize: number,
  code?: number,
  message?: string,
) => {
  page = Number(page);
  pageSize = Number(pageSize);
  let nextPage = page * pageSize < totalCount ? page + 1 : null;
  let previousPage = page > 1 ? page - 1 : null;
  response.status(code || SuccessConstants.SUCCESSFULL).json({
    status: true,
    message: message || SuccessConstants.SUCCESSFULL_MESSAGE,
    data: data || null,
    totalCount: totalCount || 0,
    nextPage,
    previousPage,
  });
};

export const successPaginatedResponseWithoutDB = (
  response: Response,
  data: any,
  page: number,
  pageSize: number,
  code?: number,
  message?: string,
) => {
  let totalCount = data.length;
  let offset = (Number(page) - 1) * Number(pageSize);
  data = data.slice(offset, offset + Number(pageSize));
  let hasNextPage = offset + data.length < totalCount;
  let hasPreviousPage = Number(page) > 1;
  response.status(code || SuccessConstants.SUCCESSFULL).json({
    status: true,
    message: message || SuccessConstants.SUCCESSFULL_MESSAGE,
    data: data || null,
    totalCount: totalCount || 0,
    nextPage: hasNextPage ? Number(page) + 1 : null,
    previousPage: hasPreviousPage ? Number(page) - 1 : null,
  });
};

export const errorResponse = (
  response: Response,
  error?: any,
  code?: number,
) => {
  console.log({error})
  response.status(code || ErrorConstants.INTERNAL_SERVER_ERROR).json({
    status: false,
    message: error.message || ErrorConstants.INTERNAL_SERVER_ERROR_MESSAGE,
  });
};

