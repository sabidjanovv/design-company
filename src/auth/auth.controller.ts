import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'User signin (login)' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 201, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(@Body() signinDto: SignInDto) {
    return this.authService.signin(signinDto);
  }


  @Get('/profile')
  async adminProfileCheck(@Headers('authorization') authorization: string) {
    // Header dan tokenni ajratib olish
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token not provided');
    }

    const access_token = authorization.split(' ')[1]; // "Bearer token" formatini ajratish
    return await this.authService.adminProfileCheck(access_token);
  }
}
