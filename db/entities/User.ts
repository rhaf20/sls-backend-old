import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {UserRoles} from "../../constants";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public given_name: string

  @Column()
  public family_name: string;

  @Column()
  public email: string;

  @Column()
  public phone_number: string;

  @Column({default: UserRoles.USER})
  public role: UserRoles;

  @Column({nullable: true})
  public company: string;

  @Column({nullable: true})
  public notes: string;

  @Column({default: true})
  public active: boolean;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

}
