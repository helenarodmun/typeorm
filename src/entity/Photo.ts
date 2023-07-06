import { Entity, Column,  PrimaryGeneratedColumn, OneToOne, Relation, ManyToOne, ManyToMany } from "typeorm"
import { PhotoMetadata } from "./PhotoMetadata";
import { Author } from "./Author";
import { Album } from "./Album";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    @Column()
    description: string

    @Column()
    filename: string

    @Column("double")
    views: number

    @Column()
    isPublished: boolean

    @OneToOne(() => PhotoMetadata, (photoMetadata) => photoMetadata.photo)
    metadata: Relation<PhotoMetadata>

    @ManyToOne(() => Author, (author) => author.photos)
    author: Author

    @ManyToMany(() => Album, (album) => album.photos)
    albums: Album[]
}