import { Unauthorized } from '@app/core/exception';
import { Inject, Injectable } from '@nestjs/common';
import { LiteralObject } from '@nestjs/common/cache';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtAuthenticationModuleOptions } from './jwt-authentication.interface';
import { MODULE_OPTIONS_TOKEN } from './jwt-authentication.module-definition';

@Injectable()
export class JwtAuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(MODULE_OPTIONS_TOKEN)
    public options: JwtAuthenticationModuleOptions,
  ) {}

  async validateRequest(request: Request) {
    const token = this.extractFromAuthHeaderAsBearerToken(request);

    try {
      const decoded = this.jwtService.verify<LiteralObject>(token, {
        secret: this.options.secretOrKey,
        algorithms: ['HS256'],
      });

      Object.assign(request, { payload: decoded });
      return true;
    } catch (error) {
      throw new Unauthorized(
        "Your authorization token isn't valid. Please login again!",
      );
    }
  }

  extractFromAuthHeaderAsBearerToken(req: Request) {
    // Parse the injected ID token from the request header.
    const token = req.headers.authorization || '';

    return token.trim().replace('Bearer ', '');
  }

  public generateAccessToken(payload: LiteralObject): string {
    return this.jwtService.sign(payload, {
      secret: this.options.secretOrKey,
      expiresIn: this.options.accessTokenExpiredIn,
    });
  }

  public generateRefreshToken(payload: LiteralObject): string {
    return this.jwtService.sign(payload, {
      secret: this.options.secretOrKey,
      expiresIn: this.options.refreshTokenExpiredIn,
    });
  }

  public verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.options.secretOrKey,
      });
      return payload;
    } catch (error) {
      return false;
    }
  }

  public verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.options.secretOrKey,
      });
      return payload;
    } catch (error) {
      return false;
    }
  }
}
