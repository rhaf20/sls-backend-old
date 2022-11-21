import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {SystemManufacturer, SystemType} from "../../constants";
import {Building} from "./Building";
import {User} from "./User";

@Entity()
export class System {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Building, Building => Building.systems, {eager: true, onDelete: "CASCADE", nullable: true})
  public building: Building;

  @Column({unique: true})
  public name: string;

  @ManyToMany(() => User, {eager: true, onDelete: "CASCADE", nullable: true})
  @JoinTable()
  users: User[];

  @Column({default: SystemType.INDIVIDUAL})
  public type: SystemType;

  @Column({default: SystemManufacturer.SANDEN})
  public hpwh_primary_manufacturer: SystemManufacturer;

  @Column()
  public hpwh_primary_number: number;

  @Column()
  public hpwh_primary_model: string;

  @Column({type: "float"})
  public hpwh_primary_btuhr: number;

  @Column({default: SystemManufacturer.SANDEN})
  public hpwh_recirc_manufacturer: SystemManufacturer;

  @Column()
  public hpwh_recirc_number: number;

  @Column({nullable: true})
  public hpwh_recirc_model: string;

  @Column({type: "float", nullable: true})
  public hpwh_recirc_btuhr: number;

  @Column({nullable: true})
  public storage_primary_number: number;

  @Column({type: "float", nullable: true})
  public storage_primary_total_gallon: number;

  @Column({nullable: true})
  public storage_recirc_number: number;

  @Column({type: "float", nullable: true})
  public storage_recirc_total_gallon: number;

  @Column({type: "float", nullable: true})
  public storage_locus_total_gallon: number;

  @Column({type: "float", nullable: true})
  public resistance_primary_kw: number;

  @Column({type: "float", nullable: true})
  public resistance_recirc_kw: number;

  @Column({default: true})
  public hybrid_hpwh_gas: boolean;

  @Column()
  public location: string;

  @Column({nullable: true})
  public notes: string;

  @Column({nullable: true})
  public default_temp_params: string;

  @Column({nullable: true})
  public default_flow_params: string;

  @Column({default: true})
  public active: boolean;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

}
