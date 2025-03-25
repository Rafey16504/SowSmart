import {z} from 'zod';
// Define the schema using Zod
// export const CreateBookTypeSchema = z.object({
//     title: z.string(),
//     author: z.string(),
//     user: z.string().optional(),
//     borrow_date: z.string().nullable().optional(),
//     borrow_status: z.string().optional(),
//     borrow_user:z.string().nullable().optional(),
//     id: z.string().optional()
//     // Define other properties if needed
// }).strict()

// Type alias for the schema type
// export type CreateBookType = z.infer<typeof CreateBookTypeSchema>;

// make a schema like this for farmer