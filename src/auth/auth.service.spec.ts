import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          synchronize: true,
          logging: false,
          entities: [User],
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') ?? 'test-secret',
            signOptions: { expiresIn: '1h' },
          }),
        }),
      ],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should create a user when google profile is new and return a jwt with profile data', async () => {
    const result = await service.validateGoogleUser({
      googleId: 'google-123',
      email: 'juan@gmail.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      picture: 'https://example.com/avatar.png',
      accessToken: 'token-123',
    });

    const payload = jwtService.decode(result.jwt) as any;

    expect(result.user.email).toBe('juan@gmail.com');
    expect(result.user.googleId).toBe('google-123');
    expect(result.jwt).toBeTypeOf('string');
    expect(result.jwt.length).toBeGreaterThan(20);
    expect(payload.email).toBe('juan@gmail.com');
    expect(payload.firstName).toBe('Juan');
    expect(payload.lastName).toBe('Pérez');
    expect(payload.picture).toBe('https://example.com/avatar.png');
  });

  it('should link google account to existing email and reuse the user', async () => {
    await service.validateGoogleUser({
      googleId: 'google-123',
      email: 'ana@gmail.com',
      firstName: 'Ana',
      lastName: 'García',
      picture: 'https://example.com/avatar-1.png',
      accessToken: 'token-a',
    });

    const result = await service.validateGoogleUser({
      googleId: 'google-456',
      email: 'ana@gmail.com',
      firstName: 'Ana',
      lastName: 'García',
      picture: 'https://example.com/avatar-2.png',
      accessToken: 'token-b',
    });

    expect(result.user.googleId).toBe('google-456');
    expect(result.user.email).toBe('ana@gmail.com');
  });
});
