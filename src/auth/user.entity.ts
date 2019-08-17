import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, CreateDateColumn } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Task } from "src/tasks/task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  created: Date

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  salt: string

  @OneToMany(type => Task, task => task.user, { eager: true })
  tasks: Task[]

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }

  toResponseObject() {
    const { id, created, username } = this
    return { id, created, username }
  }
}