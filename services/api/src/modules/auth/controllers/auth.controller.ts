import {
    Controller, Post, Body, HttpCode, HttpStatus,
    UseGuards, Get,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
  import { Throttle } from '@nestjs/throttler';
  import { AuthService } from '../services/auth.service';
  import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/create-auth.dto';
  import { JwtAuthGuard } from '../guards/jwt.guard';
  import { CurrentUser, AuthenticatedUser } from '../decorators/current-user.decorator';
  import { Public } from '../decorators/public.decorator';
  
  @ApiTags('Authentication')
  @Controller('v1/auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    @Public()
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Register a new account' })
    @ApiResponse({ status: 201, description: 'Account created. Returns token pair.' })
    @ApiResponse({ status: 409, description: 'Email already registered.' })
    register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }
  
    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Returns token pair.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    login(@Body() dto: LoginDto) {
      return this.authService.login(dto);
    }
  
    @Post('refresh')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    refresh(@Body() dto: RefreshTokenDto) {
      return this.authService.refresh(dto.refreshToken);
    }
  
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout current session' })
    logout(
      @CurrentUser() user: AuthenticatedUser,
      @Body() dto: RefreshTokenDto,
    ) {
      return this.authService.logout(user.id, dto.refreshToken);
    }
  
    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout all devices' })
    logoutAll(@CurrentUser() user: AuthenticatedUser) {
      return this.authService.logoutAllDevices(user.id);
    }
  
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current authenticated user' })
    me(@CurrentUser() user: AuthenticatedUser) {
      return user;
    }
  }