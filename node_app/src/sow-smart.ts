const express = require('express');
const multer  = require('multer');
import path from 'path'
import { v4 as uuidv4 } from "uuid";
// import { CreateBookType, CreateBookTypeSchema } from "./types/book";
import { ZodError } from "zod";
import { convertToReadableError } from "./zod-mapping";

const nodemailer = require("nodemailer");
export const appRouter = express.Router();
//branch here
// const client = require('./db') 

// const validate = (body: any): CreateBookType => {
//     try {
//       return CreateBookTypeSchema.parse(body);
//     } catch (error) {
//       if (error instanceof ZodError) {
//         throw new Error(convertToReadableError(error));
//       } else {
//         throw error;
//       }
//     }
//   };
// make a validate function like this one for farmer

