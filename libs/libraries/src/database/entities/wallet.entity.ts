import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ChainEntity } from './chain.entity';

@Entity('wallet')
export class WalletEntity {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @OneToOne(() => ChainEntity, (chain) => chain.identifier)
  @JoinColumn({ name: 'chain_identifier' })
  chain: ChainEntity;

  @Column({ nullable: false })
  address: string;
}
