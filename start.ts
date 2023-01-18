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
    const user = {
        email: "abc@gmail.com",
        username: "gordon",
        password: "tecky",
    };

    await client.query("INSERT INTO users (email,username,password,created_at,updated_at) values ($1,$2,$3,now(),now())", [
        user.email,
        user.username,
        user.password,
    ]);

    const post = {
        pet_name: "abc cat",
        gender: "M",
        birthday: "2022-10-22",
        description: "good cat",
        status: "waiting",
        size: "small"
    };
    await client.query("INSERT INTO posts (pet_name, gender, birthday, description, status, size, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,now(),now())", [
        post.pet_name,
        post.gender,
        post.birthday,
        post.description,
        post.status,
        post.size
    ])
}

main();



