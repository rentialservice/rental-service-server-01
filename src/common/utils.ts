import { ILike, In } from 'typeorm';

export function buildFilterCriteriaQuery(filterCriteria: any): any {
    Object.keys(filterCriteria).forEach((key) => {
        if (key === "search") {
            filterCriteria.name = ILike(`%${filterCriteria.search}%`);
        } else {
            if (key === "category") {
                filterCriteria.category = { id: filterCriteria.category };
            }
            if (key === "firm") {
                filterCriteria.firm = { id: filterCriteria.firm };
            }
            if (Array.isArray(filterCriteria[key])) {
                filterCriteria[key] = In(filterCriteria[key]);
            }
        }
    });
    return filterCriteria;
}