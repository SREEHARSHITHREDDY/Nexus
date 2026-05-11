import {
    Controller, Get, Post, Put, Delete,
    Body, Param, Query, HttpCode, HttpStatus,
    ParseUUIDPipe, UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
  import { CurrentUser, AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
  import { IdeasService } from '../services/ideas.service';
  import { CreateIdeaDto, UpdateIdeaDto, QueryIdeaDto } from '../dto/create-ideas.dto';
  
  @ApiTags('Ideas')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('v1/ideas')
  export class IdeasController {
    constructor(private readonly ideasService: IdeasService) {}
  
    @Post()
    @ApiOperation({ summary: 'Capture a new idea — text or voice' })
    create(
      @CurrentUser() user: AuthenticatedUser,
      @Body() dto: CreateIdeaDto,
    ) {
      return this.ideasService.create(user.id, dto);
    }
  
    @Get()
    @ApiOperation({ summary: 'List ideas with filters and pagination' })
    findAll(
      @CurrentUser() user: AuthenticatedUser,
      @Query() query: QueryIdeaDto,
    ) {
      return this.ideasService.findAll(user.id, query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a single idea by ID' })
    findOne(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.ideasService.findById(id, user.id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update an idea' })
    update(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateIdeaDto,
    ) {
      return this.ideasService.update(id, user.id, dto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft delete an idea' })
    remove(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.ideasService.delete(id, user.id);
    }
  }