import express from "express"
import { io } from "../util/connection-config";
import { communityFormidablePromise, formidablePromise } from "../util/formidable";
import { isLoggedInAPI } from "../util/guard";
import { logger } from "../util/logger";
import { client } from "../util/psql-config";

export const communityRoutes = express.Router()

// communityRoutes.put('/:id', isLoggedInAPI, updatePostById)
communityRoutes.post('/', createPost)
// communityRoutes.delete('/:id', deletePostById)
communityRoutes.get('/posts/', getPosts)
communityRoutes.get('/post/:id', getPost)

async function getPost(req: express.Request, res: express.Response) {
    const id = req.params.id;

    let result = await client.query(`
    
    select 
        cm.id as community_post_id,
        cm.content,
        cm.community_id,
        cm.media,
        cm.title,
        cm.created_at,
        u.id as user_id,
        icon,
        username
        from community_messages cm  
        join users u on u.id = cm.from_id 
        where cm.id = ${id}
        `)
    let post = result.rows[0];
    // console.log(post);

    res.json({
        data: post,
        message: 'got post'
    })

}

async function getPosts(req: express.Request, res: express.Response) {

    let result = await client.query(`
    
    select 
        cm.id as community_post_id,
        cm.content,
        cm.community_id,
        cm.media,
        cm.title,
        cm.created_at,
        u.id as user_id,
        icon,
        username
        from community_messages cm  
        join users u on u.id = cm.from_id 
        order by cm.id desc 
        `)

    let posts = result.rows
    // console.log('be4');

    console.table(posts)
    let popToday = posts.slice(0, 2)
    console.table(popToday)
    posts.splice(0, 2)
    console.table(posts)
    res.json({
        data: {
            popToday,
            allStories: posts
        },
        message: `Selected ${result.rowCount} posts.`
    })
}


async function createPost(req: express.Request, res: express.Response) {
    try {


        // 1. receiving data from user's request
        let formParedReuslt = await communityFormidablePromise(req)
        // console.log(formParedReuslt)

        // insert data into database (community)
        // console.log(req.session['user'])
        // 2. insert data into database (community_messages)
        const postData = await client.query(`insert into community_messages(
            from_id,
            content,
            community_id,
            media,
            title,
            created_at,
            updated_at
        )values ($1,$2,$3,$4,$5,now(),now() ) returning id`,
            [req.session![`user`]![`id`],
            formParedReuslt.fields.content,
                1,
            formParedReuslt.files.image.newFilename,
            formParedReuslt.fields.title

            ])

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


// async function updatePostById(
//     req: express.Request,
//     res: express.Response
// ) {
//     try {
//         let postId = req.params.id
//         let newContent = req.body.content

//         await client.query(`update posts set content = $1 where id = $2`, [
//             newContent,
//             postId
//         ])
//         io.emit('loading-post')
//         res.json({ message: 'ok' })
//     } catch (error) {
//         logger.error(error)
//         res.status(500).json({
//             message: '[POS002] - Server error'
//         })
//     }
// }

// async function deletePostById(
//     req: express.Request,
//     res: express.Response
// ) {
//     try {
//         let postId = req.params.id

//         if (!Number(postId)) {
//             res.status(400).json({
//                 message: 'Invalid post id'
//             })
//             return
//         }

//         await client.query(`delete from posts where id = $1`, [postId])

//         res.json({ message: 'delete post ok' })
//     } catch (error) {
//         logger.error(error)
//         res.status(500).json({
//             message: '[POS003] - Server error'
//         })
//     }
// }