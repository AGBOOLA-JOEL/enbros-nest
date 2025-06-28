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
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example:
      'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. In this post, we will explore the basics of NestJS and how to get started with building your first application.',
    description: 'Content of the post (1-10000 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content: string;

  @ApiProperty({
    example:
      'A comprehensive guide to getting started with NestJS framework for building scalable applications.',
    description: 'Description of the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  desc?: string;

  @ApiProperty({
    example: ['nestjs', 'nodejs', 'typescript', 'backend'],
    description: 'Tags for categorizing the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
