import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from "bcrypt";

import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto

    const salt = await bcrypt.genSalt()
    const user = new User()
    user.username = username
    user.salt = salt
    user.password = await this.hashPassword(password, user.salt)

    try {
      const _user = await user.save()
      return _user
    } catch (error) {
      if (error.code === "23505") { throw new ConflictException('Username already exist') }
      else { throw new InternalServerErrorException() }
    }

  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto
    const user = await this.findOne({ username })

    if (user && await user.validatePassword(password)) { return user.username }
    else { return null }
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}