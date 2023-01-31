import express from "express";

const app = express();

// Add this line

export interface User {
    id: number;
    email: string,
    username: string,
    icon?: string,
    password: string;
}