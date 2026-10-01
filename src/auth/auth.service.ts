import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

export type GoogleUserInput = {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
};

export type AuthenticatedUser = {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    googleId?: string;
  };
  jwt: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateGoogleUser(userData: GoogleUserInput): Promise<AuthenticatedUser> {
    const existingUserByGoogleId = await this.usersService.findByGoogleId(userData.googleId);

    if (existingUserByGoogleId) {
      const updatedUser = await this.usersService.update(existingUserByGoogleId.id, {
        email: userData.email || existingUserByGoogleId.email,
        firstName: userData.firstName || existingUserByGoogleId.firstName,
        lastName: userData.lastName || existingUserByGoogleId.lastName,
        picture: userData.picture || existingUserByGoogleId.picture,
      });

      if (!updatedUser) {
        throw new BadRequestException('No se pudo actualizar el usuario de Google.');
      }

      const jwt = this.jwtService.sign({
        sub: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        picture: updatedUser.picture,
        googleId: updatedUser.googleId ?? userData.googleId,
        accessToken: userData.accessToken,
      });
      return {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          picture: updatedUser.picture,
          googleId: updatedUser.googleId,
        },
        jwt,
      };
    }

    const existingUserByEmail = await this.usersService.findByEmail(userData.email);

    const user = existingUserByEmail
      ? await this.usersService.update(existingUserByEmail.id, {
          googleId: userData.googleId,
          firstName: userData.firstName || existingUserByEmail.firstName,
          lastName: userData.lastName || existingUserByEmail.lastName,
          picture: userData.picture || existingUserByEmail.picture,
        })
      : await this.usersService.create({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          picture: userData.picture,
          googleId: userData.googleId,
        });

    if (!user) {
      throw new BadRequestException('No se pudo persistir el usuario autenticado.');
    }

    const jwt = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      googleId: user.googleId ?? userData.googleId,
      accessToken: userData.accessToken,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        googleId: user.googleId,
      },
      jwt,
    };
  }
}
