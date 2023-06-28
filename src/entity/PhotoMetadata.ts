import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Relation,} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class PhotoMetadata {
    @PrimaryGeneratedColumn()
    id: number

    @Column("int")
    height: number

    @Column("int")
    width: number

    @Column()
    orientation: string

    @Column()
    compressed: boolean

    @Column()
    comment: string

    //one-to-one relationship
    @OneToOne(() => Photo, (photo) => photo.metadata)
    @JoinColumn()
    photo: Relation<Photo> //the Relation type container must be used in relation properties to avoid circular dependency problems.
}