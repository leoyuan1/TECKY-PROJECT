CREATE TABLE users (
    id SERIAL primary key,
    icon text,
    email TEXT not null,
    username TEXT not null,
    password TEXT not null,
    created_at TIMESTAMP without time zone DEFAULT now(),
    updated_at TIMESTAMP without time zone DEFAULT now()
);
CREATE TABLE messages (
    id SERIAL primary key,
    content TEXT,
    from_id INTEGER not null,
    FOREIGN KEY(from_id) REFERENCES users(id),
    to_id INTEGER not null,
    FOREIGN KEY(to_id) REFERENCES users(id),
    created_at TIMESTAMP without time zone DEFAULT now(),
    updated_at TIMESTAMP without time zone DEFAULT now()
);
CREATE TABLE pet_types (
    id SERIAL primary key,
    type_name TEXT,
    created_at TIMESTAMP without time zone,
    updated_at TIMESTAMP without time zone
);
CREATE TABLE species (
    id SERIAL primary key,
    pet_type_id INTEGER,
    FOREIGN KEY(pet_type_id) REFERENCES pet_types(id),
    species_name text,
    created_at TIMESTAMP without time zone,
    updated_at TIMESTAMP without time zone
);
CREATE TABLE posts (
    id SERIAL primary key,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    pet_name TEXT not null,
    pet_type_id INTEGER not null,
    FOREIGN KEY(pet_type_id) REFERENCES pet_types(id),
    species_id INTEGER,
    FOREIGN KEY(species_id) REFERENCES species(id),
    gender VARCHAR(255),
    birthday DATE,
    pet_fine_with_children BOOLEAN,
    pet_fine_with_cat BOOLEAN,
    pet_fine_with_dog BOOLEAN,
    pet_need_outing BOOLEAN,
    pet_know_hygiene BOOLEAN,
    pet_know_instruc BOOLEAN,
    pet_neutered BOOLEAN,
    pet_description TEXT,
    status TEXT,
    price INTEGER,
    created_at TIMESTAMP without time zone DEFAULT now(),
    updated_at TIMESTAMP without time zone DEFAULT now()
);
CREATE TABLE post_media (
    id SERIAL primary key,
    file_name TEXT,
    post_id INTEGER,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    media_type TEXT
);
CREATE TABLE post_comments (
    id SERIAL primary key,
    post_id INTEGER not null,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    created_at TIMESTAMP without time zone DEFAULT now(),
    updated_at TIMESTAMP without time zone DEFAULT now(),
    created_by text not null,
    updated_by text not null
);
CREATE TABLE community (
    id SERIAL primary key,
    title TEXT not null,
    created_at TIMESTAMP without time zone DEFAULT now(),
    updated_at TIMESTAMP without time zone DEFAULT now()
);
CREATE table community_members (
    id SERIAL primary key,
    community_id INTEGER not null,
    FOREIGN key(community_id) REFERENCES community(id),
    user_id INTEGER not null,
    FOREIGN key(user_id) REFERENCES users(id),
    created_at TIMESTAMP without time zone DEFAULT now(),
    updated_at TIMESTAMP without time zone DEFAULT now()
);
CREATE table community_messages (
    id SERIAL primary key,
    from_id INTEGER not null,
    FOREIGN key (from_id) REFERENCES users(id),
    content text,
    community_id INTEGER not null,
    FOREIGN key(community_id) REFERENCES community(id),
    media text,
    title text,
    created_at date DEFAULT now(),
    updated_at date DEFAULT now()
);
CREATE table post_request(
    id SERIAL primary key,
    post_id INTEGER not null,
    FOREIGN key (post_id) REFERENCES posts(id),
    status text,
    from_id INTEGER not null,
    to_id INTEGER not null,
    created_at TIMESTAMP without time zone DEFAULT now()
);