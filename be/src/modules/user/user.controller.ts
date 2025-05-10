import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Logger, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IResponse } from '@/interfaces/response.interface';
import { RoleType } from './entities/role-type';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from '@/interfaces/user.interface';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard, Role, RolesGuard } from '../../security';
import { IPaginated, IQuery } from '@/interfaces/paging.interface';
import { UserQueryDto } from './dto/user-query.dto';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    query: IQuery<User>
    private readonly logger = new Logger(UserService.name, {
        timestamp: true,
    });
    @Post()
    async create(@Body() createUserDto: CreateUserDto,
        @Req() req: Request,): Promise<IResponse<User>> {
        const data = await this.userService.create(createUserDto, req['userId']);
        this.logger.log(`Create new User Success ${createUserDto.email}`);
        return {
            data,
            message: 'Tạo tài khoản thành công',
        }
    }
    @UseGuards(AuthGuard, RolesGuard) // Bảo vệ bằng JWT
    @Role([RoleType.ADMIN])
    @Get()
    async findAll(@Query() query: UserQueryDto): Promise<IResponse<IPaginated<User>>> {
        const data = await this.userService.findAll(query);
        return {
            data, message: "Get All user success"
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Post('/login')
    async login(@Body() login: LoginDto): Promise<IResponse<LoginResponse>> {
        const data = await this.userService.login(login);
        this.logger.log(`user ${data.user.email} login success`)
        return {
            data,
            message: "Login success"
        }
    }

    @Post('/refresh-token')
    async refreshToken(@Body() body: { refreshToken: string }): Promise<IResponse<LoginResponse>> {
        const data = await this.userService.refreshToken(body.refreshToken);
        this.logger.log(`user ${data.user.email} refresh token success`)
        return {
            data,
            message: "Refresh token success"
        }
    }
}
