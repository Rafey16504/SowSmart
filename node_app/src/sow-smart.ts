const express = require('express');
const multer  = require('multer');
import path from 'path'
import { v4 as uuidv4 } from "uuid";
// import { CreateBookType, CreateBookTypeSchema } from "./types/book";
import { ZodError } from "zod";
import { convertToReadableError } from "./zod-mapping";

const nodemailer = require("nodemailer");
export const appRouter = express.Router();
// const client = require('./db') 

