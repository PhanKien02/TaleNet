import { RoleType } from "@/modules/user/enum/role-type";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";

export class RegisterDto {
        @IsString()
        @IsEmail()
        @ApiProperty({
                default: "admin@gmail.com"
        })
        email: string;

        @IsString()
        @ApiProperty({
                default: "admin"
        })
        password: string;

        @IsString()
        @ApiProperty({
                default: "admin@gmail.com"
        })
        fullName: string;

        @IsString()
        @ApiProperty({
                default: "0374824645"
        })
        phone: string;

        @IsString()
        @ApiProperty({
                default: "http://localhost:3000/avatar",
                required: false
        })
        avatarUrl?: string;

        @IsString()
        @IsEnum(RoleType)
        @ApiProperty({
                enum: RoleType,
                default: RoleType.ADMIN
        })
        role: RoleType;
}
