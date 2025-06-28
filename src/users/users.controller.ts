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
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findAll(@CurrentUser() currentUser: any) {
    // TODO: Add admin role check here
    // For now, restrict to admin users only
    // This is a placeholder - implement proper admin role system
    if (currentUser.username !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin or self only)' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    // Only allow users to access their own data or admin access
    if (currentUser.id !== id && currentUser.username !== 'admin') {
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
