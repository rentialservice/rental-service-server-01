import { In } from 'typeorm';

export function buildFilterCriteriaQuery(filterCriteria: any): any {
    const modifiedCriteria = { ...filterCriteria };
    Object.keys(modifiedCriteria).forEach((key) => {
        if (Array.isArray(modifiedCriteria[key])) {
            modifiedCriteria[key] = In(modifiedCriteria[key]);
        }
    });
    return modifiedCriteria;
}