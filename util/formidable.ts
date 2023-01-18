import express from "express";
import formidable from "formidable";

export const uploadDir = "uploads";

const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024 ** 2, // the default limit is 10MB
    filter: (part) => part.mimetype?.startsWith("image/") || false,
    filename: (originalName, originalExt, part, form) => {
        let fieldName = part.name;
        let timestamp = Date.now();
        let ext = part.mimetype?.split("/").pop();
        return `${fieldName}-${timestamp}.${ext}`;
    }
});

export function formidablePromise(req: express.Request) {
    return new Promise<any>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });
}