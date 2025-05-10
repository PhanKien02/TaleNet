import { errorMessage } from '@/common/errorMessage';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches, MinLength, } from 'class-validator';
import { RoleType } from '../entities/role-type';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "0374824645"
    })
    @IsString()
    login: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: "Admin@1234" })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        enum: RoleType,
        default: RoleType.ADMIN,
    })
    role: string;
}

export interface PayLoadToken {
    userId: number;
    role: string;
}
