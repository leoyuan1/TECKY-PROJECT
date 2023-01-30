import express from "express"
import { io } from "./util/connection-config";
import { formidablePromise } from "./util/formidable";
import { isLoggedInAPI } from "./util/guard";
import { logger } from "./util/logger";
import { client } from "./util/psql-config";

export let communityRoutes = express.Router()

communityRoutes.put('/:id', isLoggedInAPI, updatePostById)
communityRoutes.post('/', createPost)
communityRoutes.delete('/:id', deletePostById)



export async function createPost(req: express.Request, res: express.Response) {
    try {


        // 1. receiving data from user's request
        let formParedReuslt = await formidablePromise(req)
        console.log(formParedReuslt)

        // insert data into database (community)

        // 2. insert data into database (community_messages)
        const postData = await client.query(`insert in community_messages(
            from_id,
            content,
            community_id,
            created_at,
            updated_at
        )values ($1,$2,$3,now(),now() return id`)

        const postID = postData.rows[0].id;

        // 3 return response to user

        res.json({
            message: 'create new post successß'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'create new post fail'
        })
    }
}


export async function updatePostById(
    req: express.Request,
    res: express.Response
) {
    try {
        let postId = req.params.id
        let newContent = req.body.content

        await client.query(`update posts set content = $1 where id = $2`, [
            newContent,
            postId
        ])
        io.emit('loading-post')
        res.json({ message: 'ok' })
    } catch (error) {
        logger.error(error)
        res.status(500).json({
            message: '[POS002] - Server error'
        })
    }
}

export async function deletePostById(
    req: express.Request,
    res: express.Response
) {
    try {
        let postId = req.params.id

        if (!Number(postId)) {
            res.status(400).json({
                message: 'Invalid post id'
            })
            return
        }

        await client.query(`delete from posts where id = $1`, [postId])

        res.json({ message: 'delete post ok' })
    } catch (error) {
        logger.error(error)
        res.status(500).json({
            message: '[POS003] - Server error'
        })
    }
}