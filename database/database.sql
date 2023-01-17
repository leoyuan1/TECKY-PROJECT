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
    FOREIGN KEY(from_id) REFERENCES users(id),
    to_id INTEGER not null,
    FOREIGN KEY(to_id) REFERENCES users(id),
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP not null
);
CREATE TABLE pet_types (
    id SERIAL primary key,
    type TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
CREATE TABLE species (
    id SERIAL primary key,
    pet_type_id INTEGER,
    FOREIGN KEY(pet_type_id) REFERENCES pet_types(id),
    name TEXT
);
CREATE TABLE posts (
    id SERIAL primary key,
    FOREIGN KEY(id) REFERENCES users(id),
    pet_name TEXT,
    species_id INTEGER,
    FOREIGN KEY(species_id) REFERENCES species(id),
    gender TEXT,
    birthday DATE,
    user_id INTEGER,
    description TEXT,
    pet_type_id INTEGER,
    FOREIGN KEY(pet_type_id) REFERENCES pet_types(id),
    status TEXT,
    size TEXT,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP not null
);
CREATE TABLE post_media (
    id SERIAL primary key,
    FOREIGN KEY(id) REFERENCES posts(id),
    file_name TEXT,
    post_id INTEGER,
    type TEXT
);
CREATE TABLE post_comments (
    id SERIAL primary key,
    FOREIGN KEY(id) REFERENCES posts(id),
    post_id INTEGER not null,
    created_at TIMESTAMP not null,
    created_by TIMESTAMP not null,
    updated_at TIMESTAMP not null,
    updated_by TIMESTAMP not null
)