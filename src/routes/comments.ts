import express, { Router } from "express";

import prisma from "../lib/prisma/client";

import {
    validate,
    commentSchema,
    CommentData,
} from "../lib/middleware/validation";

import { checkAuthorization } from "../lib/middleware/passport";

import { initMulterMiddleware } from "../lib/middleware/multer";

const upload = initMulterMiddleware();

const router = Router();

router.get("/", async (request, response) => {
    const comments = await prisma.comment.findMany();

    response.json(comments);
});

router.get("/:id(\\d+)", async (request, response, next) => {
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

router.post(
    "/",
    checkAuthorization,
    validate({ body: commentSchema }),
    async (request, response) => {
        const commentData: CommentData = request.body;
        const username = request.user?.username as string;

        const comment = await prisma.comment.create({
            data: {
                ...commentData,
                createdBy: username,
                updatedBy: username,
            },
        });

        response.status(201).json(comment);
    }
);

router.put(
    "/:id(\\d+)",
    checkAuthorization,
    validate({ body: commentSchema }),
    async (request, response, next) => {
        const commentId = Number(request.params.id);
        const commentData: CommentData = request.body;
        const username = request.user?.username as string;

        try {
            const comment = await prisma.comment.update({
                where: { id: commentId },
                data: {
                    ...commentData,
                    updatedBy: username,
                },
            });

            response.status(200).json(comment);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /comments/${commentId}`);
        }
    }
);

router.delete(
    "/:id(\\d+)",
    checkAuthorization,
    async (request, response, next) => {
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
    }
);

router.post(
    "/:id(\\d+)/photo",
    checkAuthorization,
    upload.single("photo"),
    async (request, response, next) => {
        console.log("request.file", request.file);

        if (!request.file) {
            response.status(400);
            return next(`No photo file uploaded.`);
        }

        const photoFilename = request.file.filename;

        response.status(201).json({ photoFilename });
    }
);

router.use("/photos", express.static("uploads"));

export default router;
