import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const token = req.user?.jwt ?? req.user?.token;

    if (!token) {
      return res.status(401).json({ message: 'No se generó un token para el usuario.' });
    }

    const frontendUrl = process.env.FRONTEND_REDIRECT_URL ?? 'http://localhost:3000/login-success';
    return res.redirect(`${frontendUrl}?token=${encodeURIComponent(token)}`);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return {
      message: 'Ruta protegida accedida con JWT válido.',
      user: req.user,
    };
  }
}
