import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Model, ObjectId } from 'mongoose';
import { Topic } from './entities/topic.entity';
import { IPaginated, IQuery } from '@/interfaces/paging.interface';
import { buildFilterSortAndPaginate, paginateResponse } from '@/utils/buildFilterSortAndPaginate';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TopicService {
    constructor(@InjectModel(Topic.name) private topicModel: Model<Topic>) { }

    async create(createTopicDto: CreateTopicDto): Promise<Topic> {
        const hasTopic = await this.topicModel.findOne({ name: createTopicDto.name });
        if (hasTopic) {
            throw new BadRequestException('tên chủ đề đã tồn tại');
        }
        return await this.topicModel.create(createTopicDto);
    };

    async findAllTopic(query: IQuery<Topic>): Promise<IPaginated<Topic>> {
        const { filter, limit, sort, skip } = buildFilterSortAndPaginate(query);
        const topics = await this.topicModel.aggregate([
            {
                $match: {
                    ...filter,
                    deleted_at: null
                }
            }, { $sort: sort }, // Ensure `sort` is defined
            {
                $group: {
                    _id: null,
                    data: { $push: '$$ROOT' },
                    totalResults: { $sum: 1 },
                },
            },
            {
                $project: {
                    totalResults: 1,
                    data: { $slice: ['$data', skip, limit] }, // Ensure `skip` and `pageLimit` are defined
                },
            },
        ]);
        const totalResultsMenu = topics[0]?.totalResults || 0;
        return paginateResponse<Topic>({
            data: topics[0]?.data || [],
            page: query.page,
            limit: query.limit,
            totalResults: totalResultsMenu,
        });
    };

    async update(id: ObjectId, updateTopicDto: UpdateTopicDto): Promise<Topic | null> {
        return await this.topicModel.findByIdAndUpdate(id, updateTopicDto)
    };

    async remove(id: ObjectId) {
        return await this.topicModel.findByIdAndUpdate(id, {
            deleted_at: new Date()
        })
    }

    async removeRecycleBin(id: ObjectId) {
        return await this.topicModel.findOneAndDelete({
            _id: id,
            deleted_at: { $ne: null }
        })
    }
}
