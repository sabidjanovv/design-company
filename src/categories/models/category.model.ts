import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Collection } from '../../collections/models/collection.model';
import { CategoryType } from '../../common/enums/enum';

@Table({ tableName: 'categories' })
export class Category extends Model<Category> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column({ type: DataType.ENUM('interior', 'exterior'), allowNull: false })
  type: string;

  @HasMany(() => Collection)
  collections: Collection[];
}
