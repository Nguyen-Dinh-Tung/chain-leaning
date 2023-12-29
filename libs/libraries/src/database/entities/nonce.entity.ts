import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nonce')
export class NonceEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false })
  address: string;
}
