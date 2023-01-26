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
        await client.query("INSERT INTO pet_types (type, created_at, updated_at) values ($1,now(),now()) returning id", [
            pet_types[pet_type]
        ])
    }

    const cat_id = (await client.query("select id from pet_types where type = $1", [pet_types.type1])).rows[0].id;
    console.log("cat_id = ", cat_id);

    const cat_species = {
        name1: "波斯貓",
        name2: "短毛貓"
    };
    for (let cat_specie in cat_species) {
        await client.query("INSERT INTO species (name, pet_type_id) values ($1,$2)", [
            cat_species[cat_specie],
            cat_id,
        ])
    }

    const persian_cat_id = (await client.query("select id from species where name = $1", [cat_species.name1])).rows[0].id;
    console.log("persian_id = ", persian_cat_id);

    const short_tail_cat_id = (await client.query("select id from species where name = $1", [cat_species.name2])).rows[0].id;
    console.log("short_tail_cat_id = ", short_tail_cat_id);

    const post1 = {
        pet_name: "cat1",
        type: cat_id,
        gender: "M",
        birthday: "2022-10-22",
        description: "good cat",
        status: "waiting",
        price: 0,
        species_id: persian_cat_id,
    };
    await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, gender, birthday, description, status, price, species_id, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())", [
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
        species_id: short_tail_cat_id,
    };
    await client.query("INSERT INTO posts (user_id, pet_name, pet_type_id, gender, birthday, description, status, price, species_id, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())", [
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
