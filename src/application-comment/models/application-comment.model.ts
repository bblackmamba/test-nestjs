import { ApiProperty } from '@nestjs/swagger';
import {
    Column, Model, Table, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import User from '../../user/models/user.model';
import Application from "../../application/models/application.model";

export interface ApplicationsCommentCreationAttrs {
    publisherId: number;
    applicationId: number;
    message: string;
}

@Table({ tableName: 'application_comments' })
export default class ApplicationComment extends Model<ApplicationComment, ApplicationsCommentCreationAttrs> {
    @ApiProperty()
    @Column({
        type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
    })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    publisherId: number;

    @ForeignKey(() => Application)
    @Column({ type: DataType.STRING, allowNull: false })
    applicationId: string;

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

    @BelongsTo(() => Application)
    application: Application;
}
