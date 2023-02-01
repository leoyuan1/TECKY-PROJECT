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


    ///// add post
    const post1 = {
        title: "What is the best dogg on world?",
        content: "The best dog on world is husky!",
        media: "imag-1675219450191.jpeg",
        id: "123",
        created_at: "2021-12-25 10:14:09.316",
        updated_at: "2021-12-25 10:14:09.316",

    };
    const post1_id = (await client.query("Insert into community_messages(title, content, media, id, created_at, updated_at) values ($1,$2,$3,$4,$5,$6) returning id", [
        post1.title,
        post1.content,
        post1.id,
        post1.created_at,
        post1.updated_at

    ])).rows[0].id;

    /// post media
    const post1_media = {
        post1_media_name: "3.jpg",
        post1_media_id: post1_id,
        post1_media_type: "image"
    }
    await client.query("Insert into post1_media(media_name, media_id, media_type) values ($1, $2, $3", [
        post1_media.post1_media_name,
        post1_media.post1_media_id,
        post1_media.post1_media_type
    ]);

    await client.end();
}
main();