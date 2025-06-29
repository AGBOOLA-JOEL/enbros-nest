/* eslint-disable */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    example: 'Updated: Getting Started with NestJS',
    description: 'Title of the post (1-200 characters)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title?: string;

  @ApiProperty({
    example:
      'This is an updated version of the post content. NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
    description: 'Content of the post (1-10000 characters)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @MinLength(1, { message: 'Content must be at least 1 character long' })
  @MaxLength(10000, { message: 'Content cannot exceed 10000 characters' })
  content?: string;

  @ApiProperty({
    example:
      'An updated comprehensive guide to getting started with NestJS framework for building scalable applications.',
    description: 'Description of the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  desc?: string;

  @ApiProperty({
    example: ['nestjs', 'nodejs', 'typescript', 'backend', 'updated'],
    description: 'Tags for categorizing the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];
}
