import dayjs from "dayjs";
import { ILike, In } from 'typeorm';
import { FilterConstants } from '../constants/filter.constants';

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
  return dayjs(isoDate).format("YYYY-MM-DD");
};

export const convertToISO = (simpleDate: string): string => {
  return dayjs(simpleDate, "YYYY-MM-DD HH:mm:ss").toISOString();
};