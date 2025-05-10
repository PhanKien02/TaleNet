import { errorMessage } from '@/common/errorMessage';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { RoleType } from '../entities/role-type';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(10, 10, { message: errorMessage.PHONE_VALID })
    @ApiProperty({ default: '0374824645' })
    @Transform(({ value }) => value.trim()) // Xóa khoảng trắng thừa
    @Matches(/^(03|05|07|08|09)\d{8}$/, {
        message: "Số điện thoại không đúng định dạng"
    })
    phone: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'admin@gmail.com' })
    @Transform(({ value }) => value.trim()) // Xóa khoảng trắng thừa
    email: string;


    @IsNotEmpty()
    @Transform(({ value }) => value.trim()) // Xóa khoảng trắng thừa
    @IsString()
    @ApiProperty({
        default: 'Admin@1234',
    })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
        message: "Mật khẩu phải tối thiểu 6 ký tự bao gồm ít nhất 1 chữ cái và 1 chữ số"
    })
    password: string;

    @IsString()
    @ApiProperty({
        default: 'admin',
    })
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase()) // Chuyển chữ hoa thành chữ thường
    @ApiProperty({
        enum: RoleType,
        default: RoleType.USER,
    })
    role: string;
}
