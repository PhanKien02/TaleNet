import { IQuery } from "@/interfaces/paging.interface";
import { User } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { RoleType } from "../entities/role-type";
import { IsOptional } from "class-validator";

export class UserQueryDto extends IQuery<User> {
    @IsOptional()
    @ApiProperty({ required: false })
    isActive?: boolean
    @ApiProperty({
        enum: RoleType,
        default: RoleType.USER,
        required: false
    })
    @IsOptional()
    role?: string
}