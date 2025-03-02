import dayjs from 'dayjs';
import { ILike, In } from 'typeorm';
import { FilterConstants } from '../constants/filter.constants';
import { Period } from '../enums/period.enum';

export function buildFilterCriteriaQuery(filterCriteria: any) {
  // Create a deep copy of the filterCriteria object
  let criteria: any = JSON.parse(JSON.stringify(filterCriteria));

  Object.keys(criteria).forEach((key) => {
    if (key === 'page') {
      delete criteria[key];
    }
    if (key === 'pageSize') {
      delete criteria[key];
    }

    if (key === 'search') {
      criteria.name = ILike(`%${criteria?.search}%`);
      delete criteria?.search;
    } else {
      if (FilterConstants.FILTER_KEYS.includes(key)) {
        criteria[key] = { id: criteria[key] };
      } else if (Array.isArray(criteria[key])) {
        criteria[key] = In(criteria[key]);
      }
    }
  });
  return criteria;
}

export const convertDate = (isoDate: string): string => {
  return dayjs(isoDate).format('YYYY-MM-DD');
};

export const convertToISO = (simpleDate: string): string => {
  return dayjs(simpleDate, 'YYYY-MM-DD HH:mm:ss').toISOString();
};

export function calculatePendingAmountWithFine(rental: any) {
  const now = new Date();
  let totalFines = 0;

  for (const product of rental.rentalProduct) {
    const endDate = new Date(product.endDate);
    if (now <= endDate) continue;

    const fineAmount = parseFloat(product.fine);
    const timeDiffMs = now.getTime() - endDate.getTime();

    let periods = 0;
    switch (product?.finePeriod) {
      case Period.PerHour:
        periods = Math.ceil(timeDiffMs / (1000 * 60 * 60));
        break;
      case Period.PerDay:
        periods = Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24));
        break;
      case Period.PerWeek:
        periods = Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24 * 7));
        break;
      case Period.PerMonth:
        periods = Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24 * 30));
        break;
      case Period.PerYear:
        periods = Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24 * 365));
        break;
    }
    totalFines += periods * fineAmount;
  }
  return { totalFine: totalFines.toFixed(2) };
}
