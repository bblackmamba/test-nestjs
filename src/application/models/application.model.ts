import { ApiProperty } from '@nestjs/swagger';
import {
    Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import User from '../../user/models/user.model';
import ApplicationStatusEnum from "../enums/application-status.enum";
import ApplicationComment from "../../application-comment/models/application-comment.model";

export interface ApplicationCreationAttrs {
    publisherId: number;
    message: string;
}

@Table({ tableName: 'applications' })
export default class Application extends Model<Application, ApplicationCreationAttrs> {
    @ApiProperty()
    @Column({
        type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
    })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    publisherId: number;

    @ApiProperty()
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: ApplicationStatusEnum.Active })
    status: ApplicationStatusEnum;

    @ApiProperty()
    @Column({ type: DataType.STRING, allowNull: false })
    message: string;

    @ApiProperty()
    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @ApiProperty()
    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @BelongsTo(() => User)
    publisher: User;

    @HasMany(() => ApplicationComment)
    comments: ApplicationComment[];

}
