import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username for authentication',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'MySecurePassword123',
    description: 'Password for authentication',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
