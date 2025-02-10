import { ZodError } from "zod";

export const convertToReadableError = (error: ZodError) => {
    return error.errors.map((error) => {
        console.log("ER: ",error)
        const path = error.path.join('.');
        //@ts-ignore
        return `${path}: ${error.message} (expected ${error?.expected}, received ${error?.received})`;
    }).join('\n');
}