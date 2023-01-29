import pg from "pg";
import dotenv from "dotenv";
import { hashPassword } from "../util/Bcrypt";

dotenv.config();

const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

async function main() {
    await client.connect();
    console.log('database is connected')

    // add user
    const user1 = {
        email: "123@gmail.com",
        username: "123",
        password: await hashPassword("123"),
    };
    const user1_id = (await client.query("INSERT INTO users (email,username,password,created_at,updated_at) values ($1,$2,$3,$4,$5) returning id", [
        user1.email,
        user1.username,
        user1.password,
        "2020-01-01",
        "2020-01-01"
    ])).rows[0].id;

    const user2 = {
        email: "asd@gmail.com",
        username: "asd",
        password: await hashPassword("asd"),
    };
    const user2_id = (await client.query("INSERT INTO users (email,username,password,created_at,updated_at) values ($1,$2,$3,$4,$5) returning id", [
        user2.email,
        user2.username,
        user2.password,
        "2019-02-06",
        "2020-03-07"
    ])).rows[0].id;

    // add pet types
    const pet_types = {
        type1: "貓",
        type2: "狗",
        type3: "鳥",
        type4: "兔",
        type5: "爬蟲",
        type6: "其他"
    };
    for (let pet_type in pet_types) {
        await client.query("INSERT INTO pet_types (type_name, created_at, updated_at) values ($1,now(),now())", [
            pet_types[pet_type]
        ])
    }

    // find cat_id & dog_id
    const cat_id = (await client.query("select id from pet_types where type_name = $1", [pet_types.type1])).rows[0].id;
    console.log("cat_id = ", cat_id);
    const dog_id = (await client.query("select id from pet_types where type_name = $1", [pet_types.type2])).rows[0].id;
    console.log("dog_id = ", dog_id);

    // create cat species
    const cat_species = {
        name1: "波斯貓",
        name2: "短毛貓",
        name3: "唐貓"
    };
    for (let cat_specie in cat_species) {
        await client.query("INSERT INTO species (species_name, pet_type_id, created_at, updated_at) values ($1,$2,now(),now())", [
            cat_species[cat_specie],
            cat_id,
        ])
    }

    // create dog species
    const dog_species = {
        name1: "唐狗",
        name2: "貴婦",
        name3: "牧羊犬",
        name4: "柴犬",
        name5: "金毛尋回犬"
    };
    for (let dog_specie in dog_species) {
        await client.query("INSERT INTO species (species_name, pet_type_id, created_at, updated_at) values ($1,$2,now(),now())", [
            dog_species[dog_specie],
            dog_id,
        ])
    }

    // find cat species ids
    const cat_species1_id = (await client.query("select id from species where species_name = $1", [cat_species.name1])).rows[0].id;
    console.log("波斯貓_id = ", cat_species1_id);
    const cat_species2_id = (await client.query("select id from species where species_name = $1", [cat_species.name2])).rows[0].id;
    console.log("短毛貓_id = ", cat_species2_id);
    const cat_species3_id = (await client.query("select id from species where species_name = $1", [cat_species.name3])).rows[0].id;
    console.log("唐貓_id = ", cat_species2_id);

    // find dog species ids
    const dog_species1_id = (await client.query("select id from species where species_name = $1", [dog_species.name1])).rows[0].id;
    console.log("唐狗_id = ", dog_species1_id);
    const dog_species2_id = (await client.query("select id from species where species_name = $1", [dog_species.name2])).rows[0].id;
    console.log("貴婦_id = ", dog_species2_id);
    const dog_species3_id = (await client.query("select id from species where species_name = $1", [dog_species.name3])).rows[0].id;
    console.log("牧羊犬_id = ", dog_species3_id);
    const dog_species4_id = (await client.query("select id from species where species_name = $1", [dog_species.name4])).rows[0].id;
    console.log("柴犬_id = ", dog_species4_id);
    const dog_species5_id = (await client.query("select id from species where species_name = $1", [dog_species.name5])).rows[0].id;
    console.log("金毛尋回犬_id = ", dog_species5_id);

    // post pets
    const post_cat_1 = {
        pet_name: "Meme Cat",
        type: cat_id,
        gender: "F",
        birthday: "2018-03-04",
        description: "This cat never listen to me! I hate this cat!",
        status: "active",
        price: 0,
        species_id: cat_species2_id,
        created_at: "2021-07-21",
        updated_at: "2021-08-31"
    };
    const post_cat_1_id = (await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, gender, birthday, pet_description, status, price, species_id, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id", [
        user2_id,
        post_cat_1.pet_name,
        post_cat_1.type,
        post_cat_1.gender,
        post_cat_1.birthday,
        post_cat_1.description,
        post_cat_1.status,
        post_cat_1.price,
        post_cat_1.species_id,
        post_cat_1.created_at,
        post_cat_1.updated_at
    ])).rows[0].id;

    const post_cat_2 = {
        pet_name: "土豆",
        type: cat_id,
        gender: "F",
        birthday: "2020-10-22",
        description: "齊針 之前有皮膚問題，已康復 現時有長期呼吸道問題 眼鼻耳仔會有分泌物，要經常清理",
        status: "active",
        price: 0,
        species_id: cat_species3_id,
        created_at: "2022-09-25",
        updated_at: "2022-10-10"
    };
    const post_cat_2_id = (await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, gender, birthday, pet_description, status, price, species_id, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id", [
        user1_id,
        post_cat_2.pet_name,
        post_cat_2.type,
        post_cat_2.gender,
        post_cat_2.birthday,
        post_cat_2.description,
        post_cat_2.status,
        post_cat_2.price,
        post_cat_2.species_id,
        post_cat_2.created_at,
        post_cat_2.updated_at
    ])).rows[0].id;

    const post_cat_3 = {
        pet_name: "肥豪",
        type: cat_id,
        gender: "M",
        birthday: "2021-05-05",
        description: "來歷：前主人因肥豪嚴重脫肛及卡里西病毒而棄養，貓狗場救起安排做切除壞死腸臟及固定，當初因為卡里西病毒嚴重而黎到貓舍度暫托及隔離照顧。 接手照顧7個月後 已經靚仔曬同埋無再出現脫肛問題 確保現在狀態穩定可以安排出領養啦！",
        status: "active",
        price: 0,
        species_id: cat_species2_id,
        pet_fine_with_children: true,
        pet_neutered: true,
        created_at: "2021-12-24",
        updated_at: "2021-12-25"
    };
    const post_cat_3_id = (await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, gender, birthday, pet_description, status, price, species_id, pet_fine_with_children, pet_neutered, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id", [
        user1_id,
        post_cat_3.pet_name,
        post_cat_3.type,
        post_cat_3.gender,
        post_cat_3.birthday,
        post_cat_3.description,
        post_cat_3.status,
        post_cat_3.price,
        post_cat_3.species_id,
        post_cat_3.pet_fine_with_children,
        post_cat_3.pet_neutered,
        post_cat_3.created_at,
        post_cat_3.updated_at
    ])).rows[0].id;

    const post_dog_1 = {
        pet_name: "金毛玲",
        type: dog_id,
        gender: "F",
        birthday: "2015-12-22",
        description: "She is a good dog, nice and friendly.",
        status: "active",
        price: 0,
        species_id: dog_species5_id,
        created_at: "2022-02-04",
        updated_at: "2022-03-21"
    };
    const post_dog_1_id = (await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, gender, birthday, pet_description, status, price, species_id, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id", [
        user2_id,
        post_dog_1.pet_name,
        post_dog_1.type,
        post_dog_1.gender,
        post_dog_1.birthday,
        post_dog_1.description,
        post_dog_1.status,
        post_dog_1.price,
        post_dog_1.species_id,
        post_dog_1.created_at,
        post_dog_1.updated_at
    ])).rows[0].id;

    const post_dog_2 = {
        pet_name: "廢柴",
        type: dog_id,
        gender: "M",
        birthday: "2016-10-10",
        description: "身體健康，活潑開朗",
        status: "active",
        price: 0,
        species_id: dog_species4_id,
        pet_fine_with_dog: true,
        pet_need_outing: true,
        pet_know_instruc: true,
        created_at: "2021-06-04",
        updated_at: "2021-06-04"
    };
    const post_dog_2_id = (await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, gender, birthday, pet_description, status, price, species_id, pet_fine_with_dog, pet_need_outing, pet_know_instruc, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning id", [
        user1_id,
        post_dog_2.pet_name,
        post_dog_2.type,
        post_dog_2.gender,
        post_dog_2.birthday,
        post_dog_2.description,
        post_dog_2.status,
        post_dog_2.price,
        post_dog_2.species_id,
        post_dog_2.pet_fine_with_dog,
        post_dog_2.pet_need_outing,
        post_dog_2.pet_know_instruc,
        post_dog_2.created_at,
        post_dog_2.updated_at
    ])).rows[0].id;


    // add post media
    const post_cat_1_media_a = {
        post_media_file_name: "cat1a.jpeg",
        post_media_post_id: post_cat_1_id,
        post_media_type: "image"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_cat_1_media_a.post_media_file_name,
        post_cat_1_media_a.post_media_post_id,
        post_cat_1_media_a.post_media_type
    ]);

    const post_cat_1_media_b = {
        post_media_file_name: "cat1b.jpeg",
        post_media_post_id: post_cat_1_id,
        post_media_type: "image"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_cat_1_media_b.post_media_file_name,
        post_cat_1_media_b.post_media_post_id,
        post_cat_1_media_b.post_media_type
    ]);

    const post_cat_1_media_c = {
        post_media_file_name: "cat1c.mp4",
        post_media_post_id: post_cat_1_id,
        post_media_type: "video"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_cat_1_media_c.post_media_file_name,
        post_cat_1_media_c.post_media_post_id,
        post_cat_1_media_c.post_media_type
    ]);

    const post_cat_2_media_a = {
        post_media_file_name: "cat2a.jpeg",
        post_media_post_id: post_cat_2_id,
        post_media_type: "image"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_cat_2_media_a.post_media_file_name,
        post_cat_2_media_a.post_media_post_id,
        post_cat_2_media_a.post_media_type
    ]);

    const post_cat_2_media_b = {
        post_media_file_name: "cat2b.jpeg",
        post_media_post_id: post_cat_2_id,
        post_media_type: "image"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_cat_2_media_b.post_media_file_name,
        post_cat_2_media_b.post_media_post_id,
        post_cat_2_media_b.post_media_type
    ]);

    const post_cat_3_media_a = {
        post_media_file_name: "cat3.jpeg",
        post_media_post_id: post_cat_3_id,
        post_media_type: "image"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_cat_3_media_a.post_media_file_name,
        post_cat_3_media_a.post_media_post_id,
        post_cat_3_media_a.post_media_type
    ]);

    const post_dog_1_media_a = {
        post_media_file_name: "dog1.jpg",
        post_media_post_id: post_dog_1_id,
        post_media_type: "image"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_dog_1_media_a.post_media_file_name,
        post_dog_1_media_a.post_media_post_id,
        post_dog_1_media_a.post_media_type
    ]);

    const post_dog_2_media_a = {
        post_media_file_name: "dog2.jpeg",
        post_media_post_id: post_dog_2_id,
        post_media_type: "image"
    }
    await client.query("INSERT INTO post_media (file_name, post_id, media_type) values ($1,$2,$3)", [
        post_dog_2_media_a.post_media_file_name,
        post_dog_2_media_a.post_media_post_id,
        post_dog_2_media_a.post_media_type
    ]);

    await client.end();

}

main();


// app.get("/", function (req: Request, res: Response) {
//     res.end("Hello World");
// });

// // static files 
// app.use(express.static("public"));


// //  404
// app.use((req, res) => {
//     res.redirect('404.html')
// })

// app.listen(8080, () => {
//     console.log(`Listening at http://localhost:8080`);
// });
