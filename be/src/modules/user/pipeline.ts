import { IQuery } from "@/interfaces/paging.interface";
import { buildFilterSortAndPaginate } from "@/utils/buildFilterSortAndPaginate";
import { User } from "./entities/user.entity";

export const getAllUser = (query: IQuery<User>) => {
    const { filter, limit, page, sort } = buildFilterSortAndPaginate(query);
    const pipeline = [
        {
            $match: filter
        },
        {
            $project: {
                password: 0,
                activeKey: 0,
                resetKey: 0,
                __v: 0
            }
        },
        {
            $sort: sort
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
    ];

    return pipeline;
}