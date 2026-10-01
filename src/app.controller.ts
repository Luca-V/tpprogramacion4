import { Controller, Get, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login-success')
  loginSuccess(@Query('token') token: string): string {
    if (!token) {
      return `
        <html>
          <head><title>Login inválido</title></head>
          <body style="font-family: Arial; background:#111827; color:white; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="background:#1f2937; border-radius:12px; padding:24px; max-width:500px; width:90%;">
              <h1>Login inválido</h1>
              <p>No se recibieron datos del usuario autenticado.</p>
            </div>
          </body>
        </html>
      `;
    }

    try {
      const payload = this.jwtService.verify(token);
      const email = payload.email ?? 'Sin email';
      const userId = payload.sub ?? 'Sin ID';
      const firstName = payload.firstName ?? 'Sin nombre';
      const lastName = payload.lastName ?? 'Sin apellido';
      const picture = payload.picture ?? '';
      const googleId = payload.googleId ?? 'Sin Google ID';
      const accessToken = payload.accessToken ?? 'Sin access token';
      const avatarSrc =
        picture ||
        "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' fill='#374151'/><circle cx='60' cy='46' r='24' fill='#d1d5db'/><path d='M24 92c8-18 23-27 36-27s28 9 36 27' fill='#d1d5db'/></svg>`,
          );

      return `
        <html>
          <head>
            <title>Usuario autenticado</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #111827;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 24px;
              }
              .card {
                background: #1f2937;
                border-radius: 18px;
                padding: 28px;
                max-width: 820px;
                width: 100%;
                box-shadow: 0 8px 24px rgba(0,0,0,0.25);
              }
              .profile {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 24px;
              }
              .avatar {
                width: 90px;
                height: 90px;
                border-radius: 50%;
                object-fit: cover;
                display: block;
                border: 3px solid rgba(255,255,255,0.2);
                background: #374151;
              }
              h1 {
                margin: 0 0 8px;
                font-size: 2.2rem;
              }
              .field {
                margin-top: 18px;
                padding: 14px 16px;
                border-radius: 10px;
                background: rgba(255,255,255,0.05);
                word-break: break-word;
              }
              .actions {
                display: flex;
                justify-content: flex-end;
                margin-top: 24px;
              }
              .logout-btn {
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 10px;
                padding: 12px 18px;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
              }
              strong { color: #c7d2fe; }
              pre {
                margin: 0;
                white-space: pre-wrap;
                word-break: break-word;
                font-family: Consolas, monospace;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="profile">
                <img
                  class="avatar"
                  src="${avatarSrc}"
                  alt="Foto de perfil"
                  referrerpolicy="no-referrer"
                  onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'><rect width=\'120\' height=\'120\' fill=\'#374151\'/><circle cx=\'60\' cy=\'46\' r=\'24\' fill=\'#d1d5db\'/><path d=\'M24 92c8-18 23-27 36-27s28 9 36 27\' fill=\'#d1d5db\'/></svg>');"
                />
                <div>
                  <h1>Bienvenido,<br> ${firstName} ${lastName}</h1>
                </div>
              </div>

              <div class="field">
                <strong>Google ID:</strong><br>
                ${googleId}
              </div>

              <div class="field">
                <strong>ID interno:</strong><br>
                ${userId}
              </div>

              <div class="field">
                <strong>Email:</strong><br>
                ${email}
              </div>

              <div class="field">
                <strong>Access Token:</strong>
                <pre>${accessToken}</pre>
              </div>

              <div class="actions">
                <button class="logout-btn" onclick="localStorage.removeItem('token'); window.location.href='/'">Cerrar sesión</button>
              </div>
            </div>
          </body>
        </html>
      `;
    } catch {
      return `
        <html>
          <head><title>Token inválido</title></head>
          <body style="font-family: Arial; background:#111827; color:white; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="background:#1f2937; border-radius:12px; padding:24px; max-width:500px; width:90%;">
              <h1>Token inválido</h1>
              <p>El token recibido no es válido o expiró.</p>
            </div>
          </body>
        </html>
      `;
    }
  }
}
