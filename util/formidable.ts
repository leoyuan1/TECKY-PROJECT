import formidable from "formidable";
import express from "express";
import fs from "fs";
const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });
const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 ** 3,
    filter: (part) => part.mimetype?.startsWith("image/") || false,
});

export function formParsePromise(req: express.Request) {
    return new Promise<any>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err)
                return
            }
            resolve({ fields, files })
        })
    })
}