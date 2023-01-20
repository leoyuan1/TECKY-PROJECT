import express from 'express';
import { Request, Response } from 'express';
import { formidablePromise } from './util/formidable';

import { logger } from './util/logger';
import { client } from './util/psql-config';
// import { formidablePromise } from "./util/formidable"
// import { io } from './util/connection-config';

export const petRoutes = express.Router();

petRoutes.get('/', getPets);
petRoutes.post('/', postPets);
petRoutes.put('/:id', updatePets);
petRoutes.delete('/:id', deletePets);


// API --- get Pets
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
        logger.error("... [MEM000] Server error ... " + error);
        res.status(500).json({ message: "[MEM000] Server error" });
    }
}

// API --- post memo (req is multipart form)
async function postPets(req: Request, res: Response) {
    try {

        // receive data from client
        const { fields, files } = await formidablePromise(req);
        logger.debug(`fields = ${fields}`);
        logger.debug(`files = ${files}`);

        // prepare data
        const {

            adoption_pet_name,
            adoption_pet_type,
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
        const { image } = files;

        // check species id
        const species_id = (await client.query("select id from species where name = $1", [adoption_species_name])).rows[0].id;

        // insert data to database
        await client.query("");

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