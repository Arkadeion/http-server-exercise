import "dotenv/config";
import express from "express";
import "express-async-errors";
import cors from "cors";
import config from "./config";

import { validationErrorMiddleware } from "./lib/middleware/validation";

import commentsRoutes from "./routes/comments";

const app = express();

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:8080",
};

const port = config.PORT;

app.use(cors(corsOptions));

app.use("/comments", commentsRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(validationErrorMiddleware);

export default app;
