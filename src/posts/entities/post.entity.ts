/* eslint-disable */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the post',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Getting Started with NestJS',
    description: 'Title of the post',
  })
  @Column()
  title: string;

  @ApiProperty({
    example:
      'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
    description: 'Content of the post',
  })
  @Column('text')
  content: string;

  @ApiProperty({
    type: () => User,
    description: 'Author of the post',
  })
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the author of the post',
  })
  @Column()
  authorId: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Date when the post was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Date when the post was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
