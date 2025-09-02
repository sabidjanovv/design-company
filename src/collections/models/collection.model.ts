import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Admin } from '../../admins/models/admin.model';
import { Image } from '../../images/models/image.model';
import { Category } from '../../categories/models/category.model';

@Table({ tableName: 'collections' })
export class Collection extends Model<Collection> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Admin)
  @Column(DataType.INTEGER)
  added_admin_id: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.TEXT)
  description: string;

  @ForeignKey(() => Image) // asosiy rasm
  @Column(DataType.INTEGER)
  main_image_id: number;
  @BelongsTo(() => Image, { as: 'mainImage' }) // alias berildi
  mainImage: Image;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  category_id: number;

  @HasMany(() => Image, { as: 'images' }) // alias berildi
  images: Image[];
}
