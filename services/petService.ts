import type { Client } from "pg";

export class PetService {

    constructor(private client: Client) {}

    async getMedia(petID: number) {
        const result = await this.client.query(`
            select * from post_media
            where post_id = $1`, [petID]);
        return result.rows;
    }

    async getPets(queriesLength: number, queries: any) {

        let sqlParameters = [];
        let sqlString = `
            select
            posts.id,
            user_id,
            pet_name,
            posts.pet_type_id,
            pet_types.type_name,
            posts.species_id,
            species.species_name,
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
            posts.created_at,
            posts.updated_at
            from posts 
            left join pet_types on posts.pet_type_id = pet_types.id
            left join species on posts.species_id = species.id
            where status != 'hidden' `;

        if (queriesLength > 0) {
            sqlString += "and ";
            for (let key in queries) {
                if (queries[key]) {
                    if (sqlParameters.length > 0) { sqlString += "and " }
                    sqlParameters.push(queries[key]);
                    if (key === 'pet_name') {
                        sqlString += `posts.${key} ilike $${sqlParameters.length} `;
                        console.log(sqlString);

                    } else {
                        sqlString += `posts.${key} = $${sqlParameters.length} `;
                    }
                }
            }
        }

        sqlString += `order by posts.created_at desc`;

        const result = await this.client.query(sqlString, sqlParameters);
        return result.rows;

    }

}