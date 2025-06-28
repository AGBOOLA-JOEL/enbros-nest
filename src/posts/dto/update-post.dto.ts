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
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    example:
      'This is an updated version of the post content. NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
    description: 'Content of the post (1-10000 characters)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content?: string;

  @ApiProperty({
    example:
      'An updated comprehensive guide to getting started with NestJS framework for building scalable applications.',
    description: 'Description of the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  desc?: string;

  @ApiProperty({
    example: ['nestjs', 'nodejs', 'typescript', 'backend', 'updated'],
    description: 'Tags for categorizing the post (optional)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
