/* eslint-disable */
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          username: 'john_doe',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findAll(@CurrentUser() currentUser: any) {
    // Check if user is admin (dev-admin or admin)
    if (
      currentUser.username !== 'dev-admin' &&
      currentUser.username !== 'admin'
    ) {
      throw new ForbiddenException('Admin access required');
    }

    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin or self only)' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: User,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'john_doe',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    // Only allow users to access their own data or admin access
    if (
      currentUser.id !== id &&
      currentUser.username !== 'dev-admin' &&
      currentUser.username !== 'admin'
    ) {
      throw new ForbiddenException('You can only access your own user data');
    }

    const user = await this.usersService.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }

    // Return user without password (already excluded in service)
    return user;
  }
}
