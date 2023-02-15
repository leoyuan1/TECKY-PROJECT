import express from 'express';
import { Request, Response } from 'express';
import { json } from 'stream/consumers';
// import session from 'express-session';
import { formidablePromise } from '../util/formidable';
import { logger } from '../util/logger';
import { client } from '../util/psql-config';
import { User } from '../util/session';
import { unlink } from 'node:fs';
import path from 'path';
// import { User } from './util/session';
// import { formidablePromise } from "./util/formidable"
// import { io } from './util/connection-config';

import { petController } from '../server';

export function makePetRoutes() {
    const petRoutes = express.Router();
    
    petRoutes.get('/one-pet/:id/media', petController.getMedia);
    petRoutes.get('/all-pets', petController.getPets);
    petRoutes.get('/pet-types', getPetTypes);
    petRoutes.get('/pet-type-id/:id/species', getSpecies);
    petRoutes.post('/', postPets);
    petRoutes.put('/:id', updatePets);
    petRoutes.delete('/:id', deletePets);
    petRoutes.get('/posted-pets', postedPets);
    petRoutes.put('/post-status/:id', status)
    petRoutes.post('/request', request)
    petRoutes.post('/request-detail', detail)
    petRoutes.put('/change-request-O-status/:id', changeRequestO)
    petRoutes.put('/change-request-X-status/:id', changeRequestX)
    petRoutes.get('/application-status', applicationStatus)

    return petRoutes;
}

// API --- get Pet Types
async function getPetTypes(req: Request, res: Response) {
    try {

        // find data from database
        const result = await client.query("select id, type_name from pet_types");
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
        const result = await client.query("select id, species_name from species where pet_type_id = $1", [petTypeID]);
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

        // process fields, make empty field null
        let fields_processed = fields;
        for (let key in fields_processed) {
            if (!fields_processed[key]) {
                fields_processed[key] = null;
            }
        }

        if (!req.session.user) {
            res.json({
                message: 'no session data',
            })
            return
        }

        // prepare data
        const userID = req.session.user['id'];

        let {

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

        } = fields_processed;

        // console.log('fields_processed = ', fields_processed);

        // return if no pet name
        if (adoption_pet_name == null) {
            logger.debug('no pet name');
            res.json({
                message: "missing pet name",
            });
            return;
        }

        // return if no pet type
        if (adoption_pet_type == null) {
            logger.debug('no pet type');
            res.json({
                message: "missing pet type",
            });
            return;
        }

        // prepare species id
        let speciesID = adoption_species_choice;
        if (speciesID == 'define') {
            const alreadyExistSpecies = (await client.query("select id from species where species_name = $1", [adoption_species_name])).rows[0];
            if (alreadyExistSpecies) {
                speciesID = alreadyExistSpecies.id;
            } else {
                speciesID = await client.query("insert into species (pet_type_id, species_name) values ($1, $2) returning id", [
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
        // console.log('birthday = ', birthday);

        // set default status
        const defaultStatus = 'active';

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
            pet_description,
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
            for (let key in files) {
                const media_type = files[key].mimetype.split('/')[0];
                const fileName = files[key].newFilename;
                await client.query(`insert into post_media (file_name, post_id, media_type) values ($1,$2,$3)`, [
                    fileName,
                    postID,
                    media_type
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

        let id = req.params.id
        const fileNames = (await client.query(`delete from post_media where post_id = $1 returning file_name`, [id])).rows;
        await client.query('delete from post_request where post_id = $1', [id])
        await client.query('delete from posts where id = $1', [id])

        // delete from uploads folder
        for (let fileName of fileNames) {
            const pathLocation = path.join(__dirname, `uploads/pet-img/${fileName.file_name}`);
            unlink(pathLocation, (err) => {
                if (err) throw err;
            })
        }

        res.json({
            message: 'deleted'
        })

    } catch (error) {
        logger.error("... [MEM030] Server error ... " + error);
        res.status(500).json({ message: "[MEM020] Server error" });
    }
}

async function postedPets(req: Request, res: Response) {
    try {
        let session = req.session.user
        if (!session) {
            res.json({
                message: "no session data"
            })
            return
        }
        let existingUser = (await client.query('select * from users where email = $1', [session.email])).rows[0]
        // console.log(existingUser);

        let getPostData = (await client.query('select * from posts where user_id = $1', [existingUser.id])).rows
        // console.log(getPostData);

        if (!getPostData) {
            res.json({
                message: "no post"
            })
            return
        }
        res.json({
            message: 'Post Data',
            postData: getPostData
        })
    } catch (error) {
        console.log(error)
    }
}

async function status(req: Request, res: Response) {
    let result = req.params.id
    let existData = (await client.query(`select * from posts where id = $1`, [result])).rows[0]
    if (existData.status == 'active') {
        let resultStatus = (await client.query(`UPDATE posts SET status = $1, updated_at = now() WHERE id = $2 Returning status`, ['hidden', result])).rows
        res.json({
            message: 'update succeed',
            status: resultStatus
        })
    } else if (existData.status == 'hidden') {
        let resultStatus = (await client.query(`UPDATE posts SET status = $1, updated_at = now() WHERE id = $2 Returning status`, ['active', result])).rows
        res.json({
            message: 'update succeed',
            status: resultStatus
        })
    } else if (existData.status == 'adopted') {
        res.json({
            message: 'adopted'
        })
    }
}

async function request(req: Request, res: Response) {
    let result = req.body
    let session = req.session.user

    if (!session) {
        res.json('not user')
        return
    }
    let existingUser = (await client.query('select * from users where email = $1', [session.email])).rows[0]
    let postUser = (await client.query(`select * from posts where id = $1`, [result.postIDResult])).rows[0]
    console.log(existingUser.id);
    console.log(postUser.user_id);


    if (existingUser.id == postUser.user_id) {
        res.json({
            message: 'request fail'
        })
        return
    }
    let checkPostRequest = (await client.query(`select * from post_request where post_id = $1 and from_id = $2`, [postUser.id, existingUser.id])).rows[0]
    if (checkPostRequest) {
        res.json({
            message: 'requested'
        })
        return
    }

    await client.query(`insert into post_request (post_id, from_id, to_id,status, created_at) values ($1,$2,$3,$4, now())`,
        [result.postIDResult, existingUser.id, postUser.user_id, 'waiting for approval'])
    res.json({
        message: "request info",
    })
}

async function detail(req: Request, res: Response) {
    let id = req.body
    let postID = id.id

    let postIDresults = (await client.query(`select
    posts.pet_name,
    post_request.status,
    post_request.created_at,
    users.username,
    post_request.id
    from post_request
    join posts on post_request.post_id = posts.id
    join users on post_request.from_id = users.id
    where post_request.post_id = $1`, [postID])).rows

    if (!postIDresults[0]) {
        res.json({
            message: 'no request'
        })
        return
    }
    res.json({
        message: 'have request',
        data: postIDresults
    })
}

async function changeRequestO(req: Request, res: Response) {
    let result = req.params.id

    let nowStatus = (await client.query('select * from post_request where id = $1', [result])).rows[0]

    if (!nowStatus) {
        res.status(403).json({
            message: 'no request message'
        })
        return
    }

    let postStatus = await (await client.query(`update posts set status = $1 where id = $2 returning *`, ['adopted', nowStatus.post_id])).rows[0]
    if (nowStatus.status == 'waiting for approval') {

        let requestResult = (await client.query(`UPDATE post_request SET status = $1 where id = $2 returning *`, ['approval', result])).rows[0]

        let otherRequest = (await client.query(`update post_request set status = $1 where post_id = $2 and id != $3 returning id,status`, ['not approval', nowStatus.post_id, result])).rows

        res.json({
            message: 'updated all data',
            otherRequest: otherRequest,
            requestResult: requestResult,
            postStatus: postStatus
        })
    }
}

async function changeRequestX(req: Request, res: Response) {
    let result = req.params.id
    let nowStatus = (await client.query('select * from post_request where id = $1', [result])).rows[0]
    // console.log(nowStatus);

    if (!nowStatus) {
        res.status(403).json({
            message: 'no request message'
        })
        return
    }
    if (nowStatus.status == 'waiting for approval') {
        let requestResult = (await client.query(`UPDATE post_request SET status = $1 where id = $2 returning *`, ['not approval', result])).rows[0]

        // let otherRequest = (await client.query(`update post_request set status = $1 where post_id = $2 and id != $3 returning id,status`, ['not approval', nowStatus.post_id, result])).rows
        // console.log(otherRequest);
        res.json({
            message: 'updated all data',
            // otherRequest: otherRequest,
            requestResult: requestResult
        })
    }
}

async function applicationStatus(req: Request, res: Response) {
    let user = req.session.user
    if (!user) {
        return
    }
    let userID = (await client.query('select * from users where email = $1', [user.email])).rows[0].id
    let applicationRequest = (await client.query(
        `select
    posts.pet_name,
    post_request.status,
    post_request.created_at
    from post_request
    join posts on post_request.post_id = posts.id
    where post_request.from_id = $1`, [userID])).rows
    res.json({
        applicationRequest: applicationRequest
    })
}