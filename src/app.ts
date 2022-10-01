import "dotenv/config";
import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get("/comments", async (request, response) => {
    const comments = await prisma.comment.findMany();

    response.json(comments);
});

export default app;
