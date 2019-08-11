import { Controller, HttpCode, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CustomValidationPipe } from 'src/shared/validation.pipe';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  @HttpCode(201)
  @UsePipes(new CustomValidationPipe())
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<UserResponseDto> {
    return await this.authService.signUp(authCredentialsDto)
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDto)
  }
}
