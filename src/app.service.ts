import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <html>
        <head>
          <title>Login con Google</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #0f172a, #111827, #1f2937);
              color: white;
              font-family: Arial, sans-serif;
            }
            .card {
              background: rgba(17, 24, 39, 0.9);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 18px;
              padding: 40px 32px;
              width: min(420px, 90vw);
              text-align: center;
              box-shadow: 0 18px 40px rgba(15, 23, 42, 0.55);
            }
            h1 {
              margin-top: 0;
              margin-bottom: 12px;
              font-size: 2rem;
            }
            p {
              margin: 0 0 24px;
              color: #d1d5db;
              line-height: 1.5;
            }
            a.button {
              display: inline-block;
              background: #4285F4;
              color: white;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 12px;
              font-weight: 700;
              transition: transform 0.2s ease, opacity 0.2s ease;
            }
            a.button:hover {
              opacity: 0.9;
              transform: translateY(-1px);
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Iniciar sesión</h1>
            <p>Ingresá con tu cuenta de Google para continuar.</p>
            <a class="button" href="/auth/google">Iniciar sesión con Google</a>
          </div>
        </body>
      </html>
    `;
  }
}
