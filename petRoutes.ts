import express from 'express';
import { Request, Response } from 'express';
import { formidablePromise } from './util/formidable';

import { logger } from './util/logger';
import { client } from './util/psql-config';
// import { formidablePromise } from "./util/formidable"
// import { io } from './util/connection-config';

export const petRoutes = express.Router();

petRoutes.get('/all-pets', getPets);
petRoutes.get('/all-pets/by-animal/:id', getPets_by_animal);  // to do
petRoutes.get('/types', getPetTypes);
petRoutes.get('/type-id/:id/species', getSpecies);
petRoutes.post('/', postPets);
petRoutes.put('/:id', updatePets);
petRoutes.delete('/:id', deletePets);


// API --- get Pets (all)
async function getPets(req: Request, res: Response) {
    try {

        // find data from database
        const result = await client.query("select * from posts");
        const pets = result.rows;

        // send data to client
        res.json({
            data: pets,
            message: "Get pets success",
        });

    } catch (error) {
        logger.error("... [PET000] Server error ... " + error);
        res.status(500).json({ message: "[PET000] Server error" });
    }
}

// API --- get Pets (based on pet types) to do
async function getPets_by_animal(req: Request, res: Response) {
    try {

        // receive data from client
        const animalID = req.params.id;

        // find data from database
        const result = await client.query("select * from posts where pet_type_id = $1", [
            animalID
        ]);
        const pets = result.rows;

        // send data to client
        res.json({
            data: pets,
            message: "Get pets success",
        });

    } catch (error) {
        logger.error("... [PET000] Server error ... " + error);
        res.status(500).json({ message: "[PET000] Server error" });
    }
}

// API --- get Pet Types
async function getPetTypes(req: Request, res: Response) {
    try {

        // find data from database
        const result = await client.query("select id, type from pet_types")
        const petTypes = result.rows;

        // send data to client
        res.json({
            data: petTypes,
            message: "Get pet types success",
        });

    } catch (error) {
        logger.error("... [PET001] Server error ... " + error);
        res.status(500).json({ message: "[PET001] Server error" });
    }

}

// API --- get Species
async function getSpecies(req: Request, res: Response) {
    try {

        // receive data from client
        const petTypeID = req.params.id;

        // find data from database
        const result = await client.query("select id, name from species where pet_type_id = $1", [petTypeID]);
        const species = result.rows;

        // send data to client
        res.json({
            data: species,
            message: "Get species success",
        });

    } catch (error) {
        logger.error("... [PET002] Server error ... " + error);
        res.status(500).json({ message: "[PET002] Server error" });
    }
}


// API --- post memo (req is multipart form)
async function postPets(req: Request, res: Response) {
    try {

        // receive data from client
        const { fields, files } = await formidablePromise(req);

        // prepare data
        const userID = 1;
        const {

            adoption_pet_name,
            adoption_pet_type,
            adoption_species_choice,
            adoption_species_name,
            adoption_pet_gender,
            adoption_pet_age_type,
            adoption_pet_age,

            adoption_pet_fine_with_children,
            adoption_pet_fine_with_cat,
            adoption_pet_fine_with_dog,
            adoption_pet_need_outing,
            adoption_pet_know_hygiene,
            adoption_pet_know_instruc,
            adoption_pet_neutered,

            adoption_pet_other_info

        } = fields;

        // prepare species id
        let speciesID = adoption_species_choice;
        if (speciesID == 'define') {
            const alreadyExistSpecies = (await client.query("select id from species where name = $1", [adoption_species_name])).rows[0];
            if (alreadyExistSpecies) {
                speciesID = alreadyExistSpecies.id;
            } else {
                speciesID = await client.query("insert into species (pet_type_id, name) values ($1, $2) returning id", [
                    adoption_pet_type,
                    adoption_species_name
                ])
                speciesID = speciesID.rows[0].id;
            }
        }

        // prepare birthday
        let now = new Date();
        let birthday = null;
        if (adoption_pet_age_type === "year") {
            birthday = now;
            birthday.setFullYear(now.getFullYear() - adoption_pet_age);
        } else if (adoption_pet_age_type === "month") {
            birthday = now;
            birthday.setMonth(now.getMonth() - adoption_pet_age);
        }

        // set default status
        const defaultStatus = 'waiting';

        // set default price
        const defaultPrice = 0;

        // insert data to database (posts)
        const postedResult = await client.query(`insert into posts (
            user_id, 
            pet_name, 
            pet_type_id, 
            species_id, 
            gender, 
            birthday, 
            pet_fine_with_children, 
            pet_fine_with_cat,
            pet_fine_with_dog,
            pet_need_outing,
            pet_know_hygiene,
            pet_know_instruc,
            pet_neutered,
            description,
            status,
            price,
            created_at,
            updated_at
            ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,now(),now()) returning id`, [
            userID,
            adoption_pet_name,
            adoption_pet_type,
            speciesID,
            adoption_pet_gender,
            birthday,
            adoption_pet_fine_with_children,
            adoption_pet_fine_with_cat,
            adoption_pet_fine_with_dog,
            adoption_pet_need_outing,
            adoption_pet_know_hygiene,
            adoption_pet_know_instruc,
            adoption_pet_neutered,
            adoption_pet_other_info,
            defaultStatus,
            defaultPrice,
        ]);

        const postID = postedResult.rows[0].id;

        // insert data to database (post_media)
        if (files) {
            for (let media in files) {
                const fileName = files[media].newFilename;
                await client.query(`insert into post_media (file_name, post_id) values ($1,$2)`, [
                    fileName,
                    postID
                ])
            }
        }

        // msg to client
        res.json({
            message: "pet posted",
        });

        // broadcast to everyone
        // io.emit("new-pet");

    } catch (error) {
        logger.error("... [MEM010] Server error ... " + error);
        res.status(500).json({ message: "[MEM010] Server error" });
    }
}


// API --- update pet (req is json)
async function updatePets(req: Request, res: Response) {
    try {

        // receive data from client


        // update data at database


        // msg to client


    } catch (error) {
        logger.error("... [MEM020] Server error ... " + error);
        res.status(500).json({ message: "[MEM020] Server error" });
    }
}


// API --- delete pet
async function deletePets(req: Request, res: Response) {
    try {

        // receive data from client


        // read data from server


        // msg to client


    } catch (error) {
        logger.error("... [MEM030] Server error ... " + error);
        res.status(500).json({ message: "[MEM020] Server error" });
    }
}