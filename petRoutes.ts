import express from 'express';
import { Request, Response } from 'express';

import { logger } from './util/logger';
// import { formidablePromise } from "./util/formidable"
// import { client } from './util/psql-config';
// import { io } from './util/connection-config';

export const petRoutes = express.Router();

petRoutes.get('/pets', getPets);
petRoutes.post('/pets', postPets);
petRoutes.put('/pets/:id', updatePets);
petRoutes.delete('/pets/:id', deletePets);


// API --- get Pets
async function getPets(req: Request, res: Response) {
    try {

        // find data from database


        // send data to client
        res.json({
            // data: pets,
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


        // insert data to database


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