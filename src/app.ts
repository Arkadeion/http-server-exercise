import "dotenv/config";
import express from "express";
import "express-async-errors";
import config from "./config";

import { initCorsMiddleware } from "./lib/middleware/cors";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import { initSessionMiddleware } from "./lib/middleware/session";
import { passport } from "./lib/middleware/passport";

import commentsRoutes from "./routes/comments";
import authRoutes from "./routes/auth";

const app = express();

app.use(initSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(initCorsMiddleware());

const port = config.PORT;

app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(validationErrorMiddleware);

export default app;
