import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  // Adicione outros campos conforme necessário
}

