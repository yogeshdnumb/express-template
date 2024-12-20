import express from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import "./config/passport.config";
import "dotenv/config";
import cookieParser from "cookie-parser";

import indexRouter from "./routers/index.router";
import authRouter from "./routers/auth.router";
import passport from "passport";

export const app = express();
app.use(cookieParser("cookie session secret"));
app.use((req, res, next) => {
  // res.cookie("ngrok-skip-browser-warning", "true");
  console.log(process.env.NODE_ENV);
  console.log(req.cookies);
  next();
});
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // secure: process.env.NODE_ENV == "development" ? false : true,
      // httpOnly: auto,
      secure: true,

      sameSite: "none",
    },
    secret: "cookie session secret",
    resave: false,
    saveUninitialized: false,

    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.session());
app.use(compression());
// app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL as string,
      "https://yogisite.netlify.app",
    ],
  }),
);
app.use(morgan("dev"));

app.use("/", indexRouter);
app.use("/auth", authRouter);
