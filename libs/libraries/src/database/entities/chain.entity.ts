import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('chain')
export class ChainEntity {
  @PrimaryColumn({ length: 20, nullable: false })
  identifier: string;

  @Column()
  name: string;
}
