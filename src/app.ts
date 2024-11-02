import express from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import "./config/passport.config";

import indexRouter from "./routers/index.router";
import authRouter from "./routers/auth.router";
import passport from "passport";

export const app = express();
app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: "cookie session secret",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());
app.use(compression());
// app.use(helmet());
app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));
app.use(morgan("dev"));

app.use("/", indexRouter);
app.use("/auth", authRouter);
