import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJWT } from "passport-jwt";
import * as config from "config";

import { JwtPayload } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

const jwtConfig = config.get('jwt')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload
    const user = await this.userRepository.findOne({ username })

    if (!user) throw new UnauthorizedException()
    return user
  }
}


