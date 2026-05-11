import {
    Injectable, UnauthorizedException,
    ConflictException, NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { ConfigService } from '@nestjs/config';
  import { EventEmitter2 } from '@nestjs/event-emitter';
  import { UserEntity } from '../../users/entities/users.entity';
  import { TokenService, TokenPair } from './token.service';
  import { AuthRepository } from '../repositories/auth.repository';
  import { RegisterDto, LoginDto } from '../dto/create-auth.dto';
  import { LoggerService } from '../../../core/logging/logger.service';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(UserEntity)
      private readonly users: Repository<UserEntity>,
      private readonly tokenService: TokenService,
      private readonly authRepo: AuthRepository,
      private readonly config: ConfigService,
      private readonly logger: LoggerService,
      private readonly events: EventEmitter2,
    ) {}
  
    async register(dto: RegisterDto): Promise<TokenPair> {
      const existing = await this.users.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (existing) {
        throw new ConflictException('An account with this email already exists');
      }
  
      const rounds       = this.config.get<number>('auth.bcryptRounds', 12);
      const passwordHash = await bcrypt.hash(dto.password, rounds);
  
      const user = await this.users.save({
        email:        dto.email.toLowerCase(),
        name:         dto.name,
        timezone:     dto.timezone ?? 'UTC',
        passwordHash,
        provider:     'email',
        emailVerified: false,
      });
  
      this.logger.log(`New user registered: ${user.id}`, 'AuthService');
      this.events.emit('user.registered', { userId: user.id, email: user.email });
  
      return this.tokenService.generateTokenPair(user.id, user.email, user.plan);
    }
  
    async login(dto: LoginDto): Promise<TokenPair> {
      const user = await this.users.findOne({
        where:  { email: dto.email.toLowerCase() },
        select: ['id', 'email', 'plan', 'passwordHash'],
      });
  
      if (!user?.passwordHash) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      const valid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!valid) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      this.logger.log(`User logged in: ${user.id}`, 'AuthService');
      return this.tokenService.generateTokenPair(user.id, user.email, user.plan);
    }
  
    async refresh(refreshToken: string): Promise<TokenPair> {
      const stored = await this.authRepo.findValidToken(refreshToken);
      if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
  
      const user = await this.users.findOne({ where: { id: stored.userId } });
      if (!user) throw new NotFoundException('User not found');
  
      await this.authRepo.revokeToken(refreshToken);
      return this.tokenService.generateTokenPair(user.id, user.email, user.plan);
    }
  
    async logout(userId: string, refreshToken: string): Promise<void> {
      await this.authRepo.revokeToken(refreshToken);
      this.logger.log(`User logged out: ${userId}`, 'AuthService');
    }
  
    async logoutAllDevices(userId: string): Promise<void> {
      await this.authRepo.revokeAllUserTokens(userId);
      this.logger.log(`All sessions revoked: ${userId}`, 'AuthService');
    }
  }