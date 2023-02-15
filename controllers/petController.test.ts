import { Request, Response } from "express";
import { Client } from "pg";
import { PetService } from "../services/petService";
import { createRequest, createResponse } from "../util/test-helpers";
import { PetController } from "./petController";


describe("PetController", () => {

    let petService: PetService;
    let petController: PetController;
    let req: Request;
    let res: Response;

    beforeEach(() => {

        petService = new PetService({} as Client);

        petService.getMedia = jest.fn(async (petID: number) => [
            { id: 1, file_name: "media 1", post_id: 1, media_type: "video" }
        ])

        petService.getPets = jest.fn(async (queriesLength: number, queries: []) => [
            { id: 1, user_id: 1, pet_name: "pet 1", pet_type_id: 1 }
        ])

        petController = new PetController(petService);

        req = createRequest();
        res = createResponse();

    })

    it("should get media", async () => {
        await petController.getMedia(req, res);
        expect(petService.getMedia).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith([{ id: 1, file_name: "media 1", post_id: 1, media_type: "video" }]);
    })

});