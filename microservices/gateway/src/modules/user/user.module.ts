import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/security/passport.jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: './proto/user.proto',
          loader: {
            includeDirs: [
              join(__dirname, './proto'),
              join(__dirname, '../node_modules/google-proto-files'),
            ],
          },
          url: '0.0.0.0:3001',
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
