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

app.get("/comments/:id(\\d+)", async (request, response, next) => {
    const commentId = Number(request.params.id);

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
    });

    if (!comment) {
        response.status(404);
        return next(`Cannot GET /comments/${commentId}`);
    }

    response.json(comment);
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

app.put(
    "/comments/:id(\\d+)",
    validate({ body: commentSchema }),
    async (request, response, next) => {
        const commentId = Number(request.params.id);

        const commentData: CommentData = request.body;

        try {
            const comment = await prisma.comment.update({
                where: { id: commentId },
                data: commentData,
            });

            response.status(200).json(comment);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /comments/${commentId}`);
        }
    }
);

app.delete("/comments/:id(\\d+)", async (request, response, next) => {
    const commentId = Number(request.params.id);

    try {
        await prisma.comment.delete({
            where: { id: commentId },
        });

        response.status(204).end();
    } catch (error) {
        response.status(404);
        next(`Cannot DELETE /comments/${commentId}`);
    }
});

app.use(validationErrorMiddleware);

export default app;
