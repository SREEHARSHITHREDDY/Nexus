import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { AuthRepository } from '../repositories/auth.repository';

export interface TokenPair {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
}

export interface JwtPayload {
  sub:   string;
  email: string;
  plan:  string;
  iat?:  number;
  exp?:  number;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly authRepo: AuthRepository,
  ) {}

  async generateTokenPair(
    userId: string,
    email: string,
    plan: string,
  ): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, email, plan };

    const accessToken = this.jwt.sign(payload, {
      secret:    this.config.get<string>('auth.jwtSecret'),
      expiresIn: this.config.get<string>('auth.jwtAccessExpiresIn', '15m'),
    });

    const refreshToken      = randomBytes(64).toString('hex');
    const refreshExpiresIn  = 7 * 24 * 60 * 60; // 7 days
    const expiresAt         = new Date(Date.now() + refreshExpiresIn * 1000);

    await this.authRepo.saveRefreshToken(userId, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 min in seconds
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwt.verify<JwtPayload>(token, {
      secret: this.config.get<string>('auth.jwtSecret'),
    });
  }
}