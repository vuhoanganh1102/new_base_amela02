import { JwtAuthenticationService } from '@app/jwt-authentication';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtAuthenticationService: JwtAuthenticationService,
  ) {}

  getHello() {
    try {
      return this.jwtAuthenticationService.generateAccessToken({
        id: 1,
        roleId: 1,
        userType: 'SUPER_ADMIN',
      });
    } catch (error) {
      console.log(error);
    }
  }
}
