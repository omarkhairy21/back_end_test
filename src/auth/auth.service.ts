import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenPayload } from '@/types';
import { UserService } from '@/user/user.service';
import { UserDto } from '@/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    // find the user in your database
    const user = await this.userService.findOneByUsername(username);
    if (!user) return null;
    // compare the provided password with decrypted password
    const isPasswordValid = await this.userService.comparePassword(
      password,
      user.password,
    );

    if (isPasswordValid) return user;

    return null;
  }

  // validate the user from the JWT token
  async validateUserFromJwt(payload: TokenPayload): Promise<UserDto | null> {
    const user = await this.userService.findOneByUsername(payload.username);
    if (!user) return null;
    return user;
  }

  // generate the JWT token
  generateJwtToken(user: UserDto): string {
    const payload: TokenPayload = {
      username: user.username,
      userId: user.id,
    };
    return this.jwtService.sign(payload);
  }
}
