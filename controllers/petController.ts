import { Request, Response } from "express"
import { PetService } from "../services/petService";
import { logger } from "../util/logger";

export class PetController {

    constructor(private petService: PetService) { }

    getMedia = async (req: Request, res: Response) => {
        try {
            console.log("this = ", this);

            // receive data from client
            const petID = Number(req.params.id);

            // get data from service
            const media = await this.petService.getMedia(petID);

            // send data to client
            res.json({
                data: media,
                message: "Get pets success",
            });

        } catch (error) {
            logger.error("... [PET000] Server error ... " + error);
            res.status(500).json({ message: "[PET000] Server error" });
        }
    }

    getPets = async (req: Request, res: Response) => {
        try {

            // get filtered info from query
            const reqQueriesLength = Object.keys(req.query).length;
            const queries = {
                id: req.query.id,
                pet_type_id: req.query.pet_type_id,
                species_id: req.query.species_id,
                pet_name: req.query.pet_name,
                gender: req.query.gender,
                pet_fine_with_children: req.query.pet_fine_with_children,
                pet_fine_with_cat: req.query.pet_fine_with_cat,
                pet_fine_with_dog: req.query.pet_fine_with_dog,
                pet_need_outing: req.query.pet_need_outing,
                pet_know_hygiene: req.query.pet_know_hygiene,
                pet_know_instruc: req.query.pet_know_instruc,
                pet_neutered: req.query.pet_neutered
            }

            // get data from service
            const pets = await this.petService.getPets(reqQueriesLength, queries);

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

    testing() {
        console.log("this = ", this);
    }

}