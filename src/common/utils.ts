import { ILike, In } from 'typeorm';

export function buildFilterCriteriaQuery(filterCriteria: any) {
    // Create a deep copy of the filterCriteria object
    let criteria: any = JSON.parse(JSON.stringify(filterCriteria));

    Object.keys(criteria).forEach((key) => {
        if (key === "page") {
            delete criteria[key];
        }
        if (key === "pageSize") {
            delete criteria[key];
        }

        if (key === "search") {
            criteria.name = ILike(`%${criteria.search}%`);
            delete criteria.search;
        } else {
            if (key === "category") {
                criteria.category = { id: criteria.category };
            }
            if (key === "firm") {
                criteria.firm = { id: criteria.firm };
            }
            if (Array.isArray(criteria[key])) {
                criteria[key] = In(criteria[key]);
            }
        }
    });
    return criteria;
}
