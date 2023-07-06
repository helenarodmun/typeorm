import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";
import { Album } from "./entity/Album";

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in the application's bootstrap

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")
        // here you can start to work with your database
        //Create new user
        // console.log("Inserting a new user into the database...");
        // const user = new User();
        // user.firstName = "Helen";
        // user.lastName = "Fish";
        // user.age = 25;
        // await AppDataSource.manager.save(user);
        // console.log("Saved a new user with id: " + user.id);

        console.log("Loading users from the database...");
        const users = await AppDataSource.manager.find(User);
        console.log("Loaded users: ", users);

        console.log(
            "Here you can setup and run express / fastify / any other framework."
        );
        //Create new photo
        // const photo = new Photo();
        // photo.name = "Me and Betty";
        // photo.description = "I am with my dog";
        // photo.filename = "photo-with-betty.jpg";
        // photo.views = 1;
        // photo.isPublished = true;

        //usando EntityManager
        //await AppDataSource.manager.save(photo);
        //load saved entity
        // const savedPhotos = await AppDataSource.manager.find(Photo)

        // get entity repositories
        const photoRepository = AppDataSource.getRepository(Photo);
        const metadataRepository = AppDataSource.getRepository(PhotoMetadata);
        // await photoRepository.save(photo);
        // console.log("Photo has been saved. Photo id is", photo.id);

        //search for records
        const savedPhotos = await photoRepository.find();
        console.log("All photos from the db: ", savedPhotos);

        const firstPhoto = await photoRepository.findOneBy({
            id: 1
        });
        console.log("First photo from the db: ", firstPhoto);

        const meAndBearsPhoto = await photoRepository.findOneBy({
            name: "Me and Bears"
        });
        console.log("Me and Bears photo from the db: ", meAndBearsPhoto);

        const allViewedPhotos = await photoRepository.findBy({ views: 1 });
        console.log("All viewed photos: ", allViewedPhotos);

        const allPublishedPhotos = await photoRepository.findBy({
            isPublished: true
        });
        console.log("All published photos: ", allPublishedPhotos);

        const [photos, photosCount] = await photoRepository.findAndCount();
        console.log("All photos: ", photos);
        console.log("Photos count: ", photosCount);
        //update record
        // const photoToUpdate = await photoRepository.findOneBy({
        //     id: 1,
        // });
        // photoToUpdate.name = "Me, my friends and polar bears";
        // await photoRepository.save(photoToUpdate);

        //delete record
        // const photoToRemove = await photoRepository.findOneBy({
        //     id: 1,
        // })
        // await photoRepository.remove(photoToRemove);

        //create photo with PhotoMetadata (relationship)
        // create a photo
        const photo = new Photo();
        photo.name = "Me and Bears";
        photo.description = "I am near polar bears";
        photo.filename = "photo-with-bears.jpg";
        photo.views = 1;
        photo.isPublished = true;

        // create a photo metadata
        const metadata = new PhotoMetadata();
        metadata.height = 640;
        metadata.width = 480;
        metadata.compressed = true;
        metadata.comment = "cybershoot";
        metadata.orientation = "portrait";
        metadata.photo = photo; // this way we connect them


        // first we should save a photo
        await photoRepository.save(photo);

        // photo is saved. Now we need to save a photo metadata
        await metadataRepository.save(metadata);

        // done
        console.log(
            "Metadata is saved, and the relation between metadata and photo is created in the database too"
        );


        //search with method
        const photos2 = await photoRepository.find({
            relations: {
                metadata: true,
            },
        });

        //search with QueryBuilder
        const photos3 = await AppDataSource.getRepository(Photo)
            .createQueryBuilder("photo")
            .innerJoinAndSelect("photo.metadata", "metadata")
            .getMany()

        const album1 = new Album()
        album1.name = "Bears"
        await AppDataSource.manager.save(album1)

        const album2 = new Album()
        album2.name = "Me"
        await AppDataSource.manager.save(album2)

        // create a few photos
        const newPhoto = new Photo()
        photo.name = "Me and Bears"
        photo.description = "I am near polar bears"
        photo.filename = "photo-with-bears.jpg"
        photo.views = 1
        photo.isPublished = true
        photo.albums = [album1, album2]
        await AppDataSource.manager.save(photo)

        // now our photo is saved and albums are attached to it
        // now lets load them:
        const loadedPhoto = await AppDataSource.getRepository(Photo).findOne({
            where: {
                id: 1,
            },
            relations: {
                albums: true,
            },
        })

        //QueryBuilder example
        const searchPhotos = await AppDataSource.getRepository(Photo)
            .createQueryBuilder("photo") // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
            .innerJoinAndSelect("photo.metadata", "metadata")
            .leftJoinAndSelect("photo.albums", "album")
            .where("photo.isPublished = true")
            .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
            .orderBy("photo.id", "DESC")
            .skip(5)
            .take(10)
            .setParameters({ photoName: "My", bearName: "Mishka" })
            .getMany()

            console.log(searchPhotos)
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
