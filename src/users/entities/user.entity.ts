/* eslint-disable */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../posts/entities/post.entity';

@Entity('users')
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username for the user',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    example: 'hashedPassword123',
    description: 'Hashed password for the user',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Date when the user was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Date when the user was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => [Post],
    description: 'Posts created by the user',
  })
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
