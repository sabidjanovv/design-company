import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Collection } from '../../collections/models/collection.model';

@Table({ tableName: 'images' })
export class Image extends Model<Image> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Collection)
  @Column(DataType.INTEGER)
  collection_id: number;

  @Column(DataType.STRING)
  image_url: string; // MinIO da file nomi yoki to‘liq URL

  @BelongsTo(() => Collection)
  collection: Collection;
}
