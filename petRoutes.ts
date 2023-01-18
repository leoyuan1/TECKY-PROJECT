import express from 'express';
import { Request, Response } from 'express';

import { logger } from './logger';
import { formidablePromise } from "./formidable"
import { client } from './psql-config';
import { io } from './connection-config';

export const petRoutes = express.Router();

petRoutes.get('/pets', getPets);
petRoutes.post('/pets', postPets);
petRoutes.put('/pets/:id', updatePets);
petRoutes.delete('/pets/:id', deletePets);


// API --- get Memos
async function getPets(req: Request, res: Response) {
    try {

        // find data from database
        const result = await client.query("select * from memos");
        const memos = result.rows;

        // send data to client
        res.json({
            data: memos,
            message: "Get memos success",
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
        const { content } = fields;
        const imageName: string = files.image ? files.image["newFilename"] : "";
        if (!content) {
            logger.error("... [MEM011] No content from client ... ");
            res.status(400).end("[MEM011] Invalid application input");
            return;
        }

        // insert data to database
        await client.query(
            `INSERT INTO memos (content, image, created_at, updated_at) 
                VALUES ($1, $2, NOW(), NOW())`,
            [content, imageName]
        );

        // msg to client
        res.json({
            message: "memo posted",
        });

        // broadcast to everyone
        io.emit("new-memo");

    } catch (error) {
        logger.error("... [MEM010] Server error ... " + error);
        res.status(500).json({ message: "[MEM010] Server error" });
    }
}


// API --- update memo (req is json)
async function updatePets(req: Request, res: Response) {
    try {

        // receive data from client
        const memoID = req.params.id;
        const newContent = req.body.content;

        // update data at database
        await client.query(
            "update memos set content = $1, updated_at = now() where id = $2",
            [newContent, memoID]
        );

        // msg to client
        res.json({
            message: "memo updated",
        });

    } catch (error) {
        logger.error("... [MEM020] Server error ... " + error);
        res.status(500).json({ message: "[MEM020] Server error" });
    }
}


// API --- delete memo
async function deletePets(req: Request, res: Response) {
    try {

        // receive data from client
        const memoID = req.params.id;

        // read data from server
        await client.query(
            "delete from memos where id = $1", [memoID]
        );

        // msg to client
        res.json({
            message: "memo deleted",
        });

    } catch (error) {
        logger.error("... [MEM030] Server error ... " + error);
        res.status(500).json({ message: "[MEM020] Server error" });
    }
}