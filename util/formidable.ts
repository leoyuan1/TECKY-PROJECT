import formidable from "formidable";
import express from "express";
import fs from "fs";

const uploadDir = "uploads/pet-img";
const uploadUserDir = "uploads/user-img";
const uploadCommunityDir = "uploads/community-img";
fs.mkdirSync(uploadDir, { recursive: true });

export const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 2,
    maxFileSize: 50 * 1024 * 1024 ** 2, // the default limit is 50MB
    filter: (part) => part.mimetype?.startsWith("image/") || part.mimetype?.startsWith("video/") || false,
    filename: (originalName, originalExt, part, form) => {
        let fieldName = part.name?.substring(0, part.name.length - 1);
        let timestamp = Date.now();
        let ext = part.mimetype?.split("/").pop();
        return `${fieldName}-${timestamp}.${ext}`;
    }
});

export const userForm = formidable({
    uploadDir: uploadUserDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024 ** 2, // the default limit is 50MB
    filter: (part) => part.mimetype?.startsWith("image/") || false,
    filename: (originalName, originalExt, part, form) => {
        let fieldName = part.name?.substring(0, part.name.length - 1);
        let timestamp = Date.now();
        let ext = part.mimetype?.split("/").pop();
        return `${fieldName}-${timestamp}.${ext}`;
    }
});

export const communityForm = formidable({
    uploadDir: uploadCommunityDir,
    keepExtensions: true,
    maxFiles: 2,
    maxFileSize: 50 * 1024 * 1024 ** 2, // the default limit is 50MB
    filter: (part) => part.mimetype?.startsWith("image/") || part.mimetype?.startsWith("video/") || false,
    filename: (originalName, originalExt, part, form) => {
        let fieldName = part.name?.substring(0, part.name.length - 1);
        let timestamp = Date.now();
        let ext = part.mimetype?.split("/").pop();
        console.log(`image = ${fieldName}-${timestamp}.${ext}`);
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

export function userFormidablePromise(req: express.Request) {
    return new Promise<any>((resolve, reject) => {
        userForm.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });
}

export function communityFormidablePromise(req: express.Request) {
    return new Promise<any>((resolve, reject) => {
        communityForm.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });
}