import { IPaginated, IQuery } from "@/interfaces/paging.interface";

export const buildFilterSortAndPaginate = <T>(query: IQuery<T>) => {
    const { limit, page, sort, searchKeyword, ...rest } = query;
    let filter: { $text?: { $search: string } } = {};
    if (query.searchKeyword) {
        filter.$text = { $search: query.searchKeyword };
    }
    if (rest) {
        filter = { ...filter, ...rest };
    }

    return {
        filter,
        sort: { ...query.sort, created_at: -1 },
        limit: +query.limit || 10,
        skip: (+query.page - 1) * query.limit || 0,
        page: query.page || 1
    };
};

export const paginateResponse = <T>({ datas, page, limit, totalResults }): IPaginated<T> => {
    return {
        datas,
        page: page || 1,
        limit: limit || 10,
        totalPages: Math.ceil(totalResults / (limit || 10)),
        totalResults,
    };
};