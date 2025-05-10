import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleType } from './role-type';
import { BaseEntity } from '@/common/base.entity';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User extends BaseEntity {
    @Prop({
        required: true,
    })
    email: string;

    @Prop()
    password: string;

    @Prop({ index: { type: 'text' } })
    fullName: string;

    @Prop()
    isActive: boolean;

    @Prop({ maxlength: 10 })
    phone: string;

    @Prop()
    avatarUrl?: string;

    @Prop()
    resetKey: string;

    @Prop()
    activeKey: string;

    @Prop({
        enum: RoleType,
        default: RoleType.USER,
    })
    role: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Compound index nếu cần:
UserSchema.index({ email: 'text', fullName: 'text', phone: 'text' }, { default_language: 'vi' });
