CREATE TABLE users (
    id SERIAL primary key,
    email TEXT not null,
    username TEXT not null,
    password TEXT not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP not null
);
CREATE TABLE messages (
    id SERIAL primary key,
    content TEXT,
    from_id INTEGER not null,
    to_id INTEGER not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP not null
);
CREATE TABLE posts (
    pet_name TEXT,
    species_id INTEGER,
    gender TEXT,
    birthday DATE,
    user_id INTEGER,
    description TEXT,
    pet_type_id INTEGER,
    status TEXT,
    size TEXT,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP not null
);
CREATE TABLE post_media (
    id SERIAL primary key,
    file_name TEXT,
    post_id INTEGER,
    type TEXT
);
CREATE TABLE pet_types (
    id SERIAL primary key,
    type TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
CREATE TABLE species (
    id SERIAL primary key,
    pet_type_id TEXT,
    name TEXT
);
CREATE TABLE post_comments (
    id SERIAL primary key,
    post_id INTEGER not null,
    created_at TIMESTAMP not null,
    created_by TIMESTAMP not null,
    updated_at TIMESTAMP not null,
    updated_by TIMESTAMP not null
)