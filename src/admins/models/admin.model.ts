// src/models/admin.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { AdminRole } from '../../common/enums/admins-role.enum';
import { Collection } from '../../collections/models/collection.model';

@Table({
  tableName: 'admins',
  timestamps: true
})
export class Admin extends Model<Admin> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  first_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  last_name: string;

  @AllowNull(false)
  @Unique(true)
  @Column({ type: DataType.STRING(50) })
  username: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(AdminRole)),
    defaultValue: AdminRole.ADMIN,
  })
  role: AdminRole;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  is_active: boolean;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  hashed_password: string;

  // Aloqa: Admin qo'shgan Projectlar
  @HasMany(() => Collection, { foreignKey: 'added_admin_id' })
  collections?: Collection[];
}
