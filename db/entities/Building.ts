import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {BuildingType, BuildingUtility} from "../../constants";
import {System} from "./System";

@Entity()
export class Building {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToMany(() => System, System => System.building)
  systems: System[];

  @Column()
  public name: string;

  @Column()
  public street: string

  @Column()
  public city: string;

  @Column()
  public state: string;

  @Column()
  public zipcode: string;

  @Column({default: BuildingType.SINGLE_FAMILY})
  public type: BuildingType;

  @Column({nullable: true})
  public owner_first_name: string;

  @Column({nullable: true})
  public owner_last_name: string;

  @Column({nullable: true})
  public owner_company: string;

  @Column({nullable: true})
  public owner_phone: string;

  @Column({nullable: true})
  public owner_email: string;

  @Column({default: BuildingUtility.PGE})
  public utility: BuildingUtility;

  @Column()
  public climate_zone: number;

  @Column({nullable: true})
  public group_weather: number;

  @Column({nullable: true})
  public group_energy_supply: number;

  @Column({nullable: true})
  public group_dispatch: number;

  @Column()
  public onsite_solar_pv: boolean;

  @Column()
  public number_story: number;

  @Column()
  public number_housing_unit: number;

  @Column({nullable: true})
  public notes: string;

  @Column({default: true})
  public active: boolean;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

}
