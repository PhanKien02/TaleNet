import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { PayLoadToken } from '@/interfaces/user.interface';
import { AuthService } from '@/modules/auth/auth.service';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SCRECT || 'default_secret_key',
        });
    }

    async validate(payLoad: PayLoadToken): Promise<any> {
        const key = `user:${payLoad.userId}`;
        const cacheUser = await this.cacheManager.get(key);
        console.log({ key, cacheUser });
        const user = await this.authService.findByUserId(+payLoad.userId);

        if (!user) {
            throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Người dùng không tồn tại trong hệ thống' });
        }
        if (!user.isActive) {
            throw new RpcException({ code: status.INVALID_ARGUMENT, message: 'Tài khoản người dùng đã bị khoá' });
        }
        return user;
    }
}
