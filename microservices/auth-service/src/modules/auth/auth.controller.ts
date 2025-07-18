import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from 'src/proto/auth/LoginResponse';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @GrpcMethod('AuthService', 'Register')
  async create(data: RegisterDto) {
    const result = await this.authService.create(data);
    return result;
  }

  @GrpcMethod('AuthService', 'Login')
  async login(login: LoginDto): Promise<LoginResponse> {
    const result = await this.authService.login(login);
    return result;
  }

  @GrpcMethod('AuthService', 'FindByUserId')
  async FindByUserId(data: any) {
    const result = await this.authService.findByUserId(data.idUser.toNumber());
    return result;
  }
  @GrpcMethod('AuthService', 'VerifyOTP')
  async verifyOTP(data: { token: string, otp: string }) {
    const result = await this.authService.ativeAccount(data.token, data.otp);
    return result;
  }
  @GrpcMethod('AuthService', 'ResendOtp')
  async resendOtp(data: { idUser: string }) {
    const result = await this.authService.resendOtp(+data.idUser);
    return result;
  }
  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: { idUser: string }) {
    const result = await this.authService.refreshToken(+data.idUser);
    return result;
  }
}
