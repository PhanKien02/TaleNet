import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { errorMessage } from '@/common/errorMessage';
import { genKeyActive } from '@/utils/gennerate-key';
import { compareSync, hashSync } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse, PayLoadToken } from '@/interfaces/user.interface';
import { IPaginated } from '@/interfaces/paging.interface';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserQueryDto } from './dto/user-query.dto';
import { getAllUser } from './pipeline';
import { paginateResponse } from '@/utils/buildFilterSortAndPaginate';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly jwtService: JwtService) { }
    async create(createUserDto: CreateUserDto, userId: number) {
        const validateEmail = await this.userModel.findOne({
            $and: [
                {
                    role: createUserDto.role,
                    email: createUserDto.email
                },
                {
                    role: createUserDto.role,
                    phone: createUserDto.phone
                }
            ]
        });
        if (validateEmail) {
            throw new BadRequestException(errorMessage.PHONE_EXITS);
        }
        const newUser = await this.userModel.create({
            ...createUserDto,
            activeKey: genKeyActive(),
            isActive: false,
            password: hashSync(createUserDto.password, 10),
            created_by: userId || null,
        });
        return newUser;
    }
    async findAll(query: UserQueryDto): Promise<IPaginated<User>> {
        const pipeline = getAllUser(query);
        const [result] = await this.userModel.aggregate(pipeline);

        return paginateResponse({
            datas: result || [],
            limit: query.limit,
            page: query.page,
            totalResults: result?.length || 0
        })
    }
    async findOneById(id: ObjectId): Promise<User> {
        const user = await this.userModel.findOne({

        });
        return user
    }
    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id: number) {
        return `This action removes a #${id} user`;
    }
    async login(payLoad: LoginDto): Promise<LoginResponse> {
        const user = await this.validateUser(payLoad);
        const payLoadAccessToken: PayLoadToken = {
            role: user.role,
            userId: user._id,
        };
        const accessToken = this.jwtService.sign(payLoadAccessToken, {
            algorithm: 'HS256',
            secret: process.env.ACCESS_TOKEN_SCRECT,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
        });

        const now = Date.now();;
        const expires = new Date(now + +process.env.ACCESS_TOKEN_EXPIRESIN).getTime();
        const refreshToken = this.jwtService.sign(
            payLoadAccessToken,
            {
                algorithm: 'HS512',
                secret: process.env.REFRESH_TOKEN_SCRECT,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
            },
        );

        return {
            user,
            accessToken,
            refreshToken,
            expires
        };
    }
    async refreshToken(token: string): Promise<LoginResponse> {
        const decode = this.jwtService.verify(token, {
            secret: process.env.REFRESH_TOKEN_SCRECT,
        });
        const user = await this.validateToken(decode)
        const payLoadToken: PayLoadToken = {
            role: user.role,
            userId: user._id,
        };
        const now = Date.now();;
        const expires = new Date(now + +process.env.ACCESS_TOKEN_EXPIRESIN).getTime();
        const accessToken = this.jwtService.sign(payLoadToken, {
            algorithm: 'HS256',
            secret: process.env.ACCESS_TOKEN_SCRECT,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
        });

        const refreshToken = this.jwtService.sign(
            payLoadToken,
            {
                algorithm: 'HS512',
                secret: process.env.REFRESH_TOKEN_SCRECT,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
            },
        );

        return {
            user,
            accessToken,
            refreshToken,
            expires
        };
    }
    async validateUser(
        payLoad: LoginDto,
    ): Promise<Omit<User, 'password' | 'activeKey' | 'resetKey'>> {

        const user = await this.userModel.findOne({
            role: payLoad.role,
            phone: payLoad.login
        }).lean();
        if (!user) throw new BadRequestException(errorMessage.LOGIN_ERROR);

        if (!compareSync(payLoad.password, user.password)) {
            throw new BadRequestException(errorMessage.LOGIN_ERROR);
        }
        const { password, activeKey, resetKey, __v, ...rest } = user;
        return rest;
    }
    async validateToken(
        payLoad: PayLoadToken): Promise<Omit<User, 'password' | 'activeKey' | 'resetKey'>> {
        const user = await this.userModel.findOne({
            _id: payLoad.userId,
            role: payLoad.role,
        }).lean();

        if (!user) throw new BadRequestException(errorMessage.TOKEN_NOT_VALID);

        return user;
    }
}
