/* eslint-disable */
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'Getting Started with NestJS',
    description: 'Title of the post (1-200 characters)',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @ApiProperty({
    example:
      'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. In this post, we will explore the basics of NestJS and how to get started with building your first application.',
    description: 'Content of the post (1-10000 characters)',
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(1, { message: 'Content must be at least 1 character long' })
  @MaxLength(10000, { message: 'Content cannot exceed 10000 characters' })
  content: string;

  @ApiProperty({
    example:
      'A comprehensive guide to getting started with NestJS framework for building scalable applications.',
    description: 'Description of the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  desc?: string;

  @ApiProperty({
    example: ['nestjs', 'nodejs', 'typescript', 'backend'],
    description: 'Tags for categorizing the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];
}
