import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import Token from '../../token/models/token.model';
import Role from '../../role/models/role.model';

export interface UserCreationAttrs {
  roleId: number;
  email: string;
  passwordHash: string;
  name: string;
}

export const PROTECTED_ATTRIBUTES: Array<string> = [
  'password',
  'recoverToken',
  'recoverRequestAt',
  'userSubscriptions',
  // 'deletedAt',
  // 'blockedTo',
];

@Table({ tableName: 'users' })
export default class User extends Model<User, UserCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

  @Column({ type: DataType.STRING, allowNull: true })
    passwordHash: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    name: string;

  @HasMany(() => Token)
    tokens: Token[];

  @Column({ type: DataType.DATE, allowNull: true })
    deletedAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
    roleId: number;

  @BelongsTo(() => Role)
    role: Role;

  toJSON(): object {
    const attributes = { ...this.get() };
    PROTECTED_ATTRIBUTES.forEach((attr) => {
      delete attributes[attr];
    });
    return attributes;
  }
}
