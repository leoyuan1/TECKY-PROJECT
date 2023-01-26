import pg from "pg";
import dotenv from "dotenv";

dotenv.config();


const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

async function main() {
    await client.connect();
    console.log('database is connected')

    const user1 = {
        email: "testing@gmail.com",
        username: "testname",
        password: "password",
    };
    await client.query("INSERT INTO users (email,username,password,created_at,updated_at) values ($1,$2,$3,now(),now())", [
        user1.email,
        user1.username,
        user1.password,
    ]);

    const pet_types = {
        type1: "貓",
        type2: "狗",
        type3: "兔",
        type4: "其他"
    };
    for (let pet_type in pet_types) {
        await client.query("INSERT INTO pet_types (pet_type_name, pet_type_created_at, pet_type_updated_at) values ($1,now(),now())", [
            pet_types[pet_type]
        ])
    }

    // find cat_id & dog_id
    const cat_id = (await client.query("select pet_type_id from pet_types where pet_type_name = $1", [pet_types.type1])).rows[0].pet_type_id;
    console.log("cat_id = ", cat_id);

    const dog_id = (await client.query("select pet_type_id from pet_types where pet_type_name = $1", [pet_types.type2])).rows[0].pet_type_id;
    console.log("dog_id = ", dog_id);

    // create cat species
    const cat_species = {
        name1: "波斯貓",
        name2: "短毛貓"
    };
    for (let cat_specie in cat_species) {
        await client.query("INSERT INTO species (species_name, pet_type_id) values ($1,$2)", [
            cat_species[cat_specie],
            cat_id,
        ])
    }

    // create dog species
    const dog_species = {
        name1: "牧羊犬",
        name2: "金毛尋回犬"
    };
    for (let dog_specie in dog_species) {
        await client.query("INSERT INTO species (species_name, pet_type_id) values ($1,$2)", [
            dog_species[dog_specie],
            dog_id,
        ])
    }

    // find cat species ids
    const cat_species1_id = (await client.query("select species_id from species where species_name = $1", [cat_species.name1])).rows[0].species_id;
    console.log("波斯貓_id = ", cat_species1_id);
    const cat_species2_id = (await client.query("select species_id from species where species_name = $1", [cat_species.name2])).rows[0].species_id;
    console.log("短毛貓_id = ", cat_species2_id);

    // find dog species ids
    const dog_species1_id = (await client.query("select species_id from species where species_name = $1", [dog_species.name1])).rows[0].species_id;
    console.log("牧羊犬_id = ", dog_species1_id);
    const dog_species2_id = (await client.query("select species_id from species where species_name = $1", [dog_species.name1])).rows[0].species_id;
    console.log("金毛尋回犬_id = ", dog_species2_id);

    // post pets
    const post1 = {
        pet_name: "cat1",
        type: cat_id,
        gender: "M",
        birthday: "2022-10-22",
        description: "good cat",
        status: "waiting",
        price: 0,
        species_id: cat_species1_id,
    };
    await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, pet_gender, pet_birthday, pet_description, post_status, pet_price, species_id, post_created_at, post_updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())", [
        1,
        post1.pet_name,
        post1.type,
        post1.gender,
        post1.birthday,
        post1.description,
        post1.status,
        post1.price,
        post1.species_id,
    ])

    const post2 = {
        pet_name: "cat2",
        type: cat_id,
        gender: "M",
        birthday: "2022-10-22",
        description: "bad cat",
        status: "waiting",
        price: 0,
        species_id: cat_species2_id,
    };
    await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, pet_gender, pet_birthday, pet_description, post_status, pet_price, species_id, post_created_at, post_updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())", [
        1,
        post2.pet_name,
        post2.type,
        post2.gender,
        post2.birthday,
        post2.description,
        post2.status,
        post2.price,
        post2.species_id,
    ])

    const post3 = {
        pet_name: "dog1",
        type: dog_id,
        gender: "F",
        birthday: "2022-12-22",
        description: "crazy dog",
        status: "waiting",
        price: 0,
        species_id: dog_species1_id,
    };
    await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, pet_gender, pet_birthday, pet_description, post_status, pet_price, species_id, post_created_at, post_updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())", [
        1,
        post3.pet_name,
        post3.type,
        post3.gender,
        post3.birthday,
        post3.description,
        post3.status,
        post3.price,
        post3.species_id,
    ])

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
