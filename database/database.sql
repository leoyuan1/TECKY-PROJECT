CREATE TABLE users (
    user_id SERIAL primary key,
    icon text,
    email TEXT not null,
    username TEXT not null,
    password TEXT not null,
    created_at date DEFAULT now(),
    updated_at date DEFAULT now()
);
CREATE TABLE messages (
    id SERIAL primary key,
    content TEXT,
    from_id INTEGER not null,
    FOREIGN KEY(from_id) REFERENCES users(user_id),
    to_id INTEGER not null,
    FOREIGN KEY(to_id) REFERENCES users(user_id),
    created_at date DEFAULT now(),
    updated_at date DEFAULT now()
);
CREATE TABLE pet_types (
    pet_type_id SERIAL primary key,
    pet_type_name TEXT,
    pet_type_created_at TIMESTAMP,
    pet_type_updated_at TIMESTAMP
);
CREATE TABLE species (
    species_id SERIAL primary key,
    species_pet_type_id INTEGER,
    FOREIGN KEY(species_pet_type_id) REFERENCES pet_types(pet_type_id),
    species_name text,
    species_created_at TIMESTAMP,
    species_updated_at TIMESTAMP
);
CREATE TABLE posts (
    post_id SERIAL primary key,
    post_user_id INTEGER,
    FOREIGN KEY(post_user_id) REFERENCES users(user_id),
    pet_name TEXT not null,
    post_pet_type_id INTEGER,
    FOREIGN KEY(post_pet_type_id) REFERENCES pet_types(pet_type_id),
    post_species_id INTEGER,
    FOREIGN KEY(post_species_id) REFERENCES species(species_id),
    pet_gender VARCHAR(255),
    pet_birthday DATE,
    pet_fine_with_children BOOLEAN,
    pet_fine_with_cat BOOLEAN,
    pet_fine_with_dog BOOLEAN,
    pet_need_outing BOOLEAN,
    pet_know_hygiene BOOLEAN,
    pet_know_instruc BOOLEAN,
    pet_neutered BOOLEAN,
    pet_description TEXT,
    post_status TEXT,
    pet_price INTEGER,
    post_created_at date DEFAULT now(),
    post_updated_at date DEFAULT now()
);
CREATE TABLE post_media (
    post_media_id SERIAL primary key,
    post_media_file_name TEXT,
    post_media_post_id INTEGER,
    FOREIGN KEY(post_media_post_id) REFERENCES posts(post_id),
    post_media_type TEXT
);
CREATE TABLE post_comments (
    post_comment_id SERIAL primary key,
    post_comment_post_id INTEGER not null,
    FOREIGN KEY(post_comment_post_id) REFERENCES posts(post_id),
    post_comment_created_at date DEFAULT now(),
    post_comment_updated_at date DEFAULT now(),
    post_comment_created_by text not null,
    post_comment_updated_by text not null
);
CREATE TABLE community (
    id SERIAL primary key,
    title TEXT not null,
    created_at date DEFAULT now(),
    updated_at date DEFAULT now()
);
CREATE table community_members (
    id SERIAL primary key,
    community_id INTEGER not null,
    FOREIGN key(community_id) REFERENCES community(id),
    user_id INTEGER not null,
    FOREIGN key(user_id) REFERENCES users(user_id),
    created_at date DEFAULT now(),
    updated_at date DEFAULT now()
);
CREATE table community_messages (
    id SERIAL primary key,
    from_id INTEGER not null,
    FOREIGN key (from_id) REFERENCES users(user_id),
    content text,
    community_id INTEGER not null,
    FOREIGN key(community_id) REFERENCES community(id),
    created_at date DEFAULT now(),
    updated_at date DEFAULT now()
);
CREATE table post_request(
    id SERIAL primary key,
    post_id INTEGER not null,
    FOREIGN key (post_id) REFERENCES post_id,
    from_id INTEGER not null,
    to_id INTEGER not null,
    created_at date DEFAULT now()
)