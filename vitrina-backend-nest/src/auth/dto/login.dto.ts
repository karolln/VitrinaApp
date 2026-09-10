import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '3001234567' })
  @IsString()
  celular: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString()
  password: string;
}