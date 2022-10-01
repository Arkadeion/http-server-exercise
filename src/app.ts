import "dotenv/config";
import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";

import {
    validate,
    commentSchema,
    CommentData,
    validationErrorMiddleware,
} from "./lib/validation";

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get("/comments", async (request, response) => {
    const comments = await prisma.comment.findMany();

    response.json(comments);
});

app.post(
    "/comments",
    validate({ body: commentSchema }),
    async (request, response) => {
        const commentData: CommentData = request.body;

        const comment = await prisma.comment.create({
            data: commentData,
        });

        response.status(201).json(comment);
    }
);

app.use(validationErrorMiddleware);

export default app;
