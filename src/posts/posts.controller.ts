/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostEntity,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Getting Started with NestJS',
        content: 'NestJS is a progressive Node.js framework...',
        desc: 'A comprehensive guide to getting started with NestJS framework for building scalable applications.',
        tags: ['nestjs', 'nodejs', 'typescript', 'backend'],
        authorId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: any) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of all posts',
    type: [PostEntity],
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Getting Started with NestJS',
          content: 'NestJS is a progressive Node.js framework...',
          desc: 'A comprehensive guide to getting started with NestJS framework for building scalable applications.',
          tags: ['nestjs', 'nodejs', 'typescript', 'backend'],
          authorId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific post (public)' })
  @ApiResponse({
    status: 200,
    description: 'Post details',
    type: PostEntity,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Getting Started with NestJS',
        content: 'NestJS is a progressive Node.js framework...',
        desc: 'A comprehensive guide to getting started with NestJS framework for building scalable applications.',
        tags: ['nestjs', 'nodejs', 'typescript', 'backend'],
        authorId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post (owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostEntity,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Updated: Getting Started with NestJS',
        content: 'This is an updated version of the post content...',
        desc: 'An updated comprehensive guide to getting started with NestJS framework for building scalable applications.',
        tags: ['nestjs', 'nodejs', 'typescript', 'backend', 'updated'],
        authorId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post (owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      example: {
        message: 'Post deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.postsService.remove(id, user);
    return { message: 'Post deleted successfully' };
  }
}
