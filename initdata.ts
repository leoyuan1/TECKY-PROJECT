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

    const user = {
        email: "testing@gmail.com",
        username: "test name",
        password: "password",
    };

    await client.query("INSERT INTO users (email,username,password,created_at,updated_at) values ($1,$2,$3,now(),now())", [
        user.email,
        user.username,
        user.password,
    ]);

    const pet_types = {
        type: "cat"
    };
    await client.query("INSERT INTO pet_types (type, created_at, updated_at) values ($1,now(),now())", [
        pet_types.type,
    ])

    const species = {
        name: "Persian cat"
    };
    await client.query("INSERT INTO species (name, pet_type_id) values ($1,$2)", [
        species.name,
        1,
    ])

    const post = {
        pet_name: "cat name",
        gender: "M",
        birthday: "2022-10-22",
        description: "good cat",
        status: "waiting",
        size: "small",
        price: 1000,
        request_nos: 0,
    };
    await client.query("INSERT INTO posts (user_id,pet_name, gender, birthday, description, status, size,price,request_nos, species_id, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now(),now())", [
        1,
        post.pet_name,
        post.gender,
        post.birthday,
        post.description,
        post.status,
        post.size,
        post.price,
        post.request_nos,
        1,
    ])
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
