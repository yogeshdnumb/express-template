import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GithubStrategy from "passport-github2";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import type { userType } from "../types";

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.serializeUser((user: any, done) => {
  // console.log("----> serialize user fn called");

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("----> deserialize user fn called");
  const user = await prisma.users.findFirst({ where: { id } });
  // console.log(user, "userrrr");

  done(null, user);
});

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/redirect`,
      // callbackURL: `https://spa38s.tunnel.pyjam.as/auth/google/redirect`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("-----> google strategy callback fn called");
      // console.log(profile);
      const foundUser = await prisma.users.findFirst({
        where: { authId: profile.id },
      });

      if (foundUser != null) {
        done(null, foundUser);
        // console.log("user already existr in verify fn");
        // console.log(foundUser, "foundUser->>>");
      } else {
        // console.log("creating new user in verify fn");
        const newUser = await prisma.users.create({
          data: {
            username: profile.displayName,
            authProvider: "google",
            authId: profile.id,
            profilePic: (profile?.photos && profile.photos[0]?.value) || "",
            email: (profile?.emails && profile?.emails[0]?.value) || "",
          },
        });
        done(null, newUser);
      }
    }
  )
);

// callbackURL: `${process.env.BACKEND_URL}/auth/github/redirect`,
passport.use(
  new GithubStrategy.Strategy(
    {
      clientID: GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_CLIENT_SECRET as string,
      // callbackURL: `https://spa38s.tunnel.pyjam.as/auth/github/redirect`,
      callbackURL: `${process.env.BACKEND_URL}/auth/github/redirect`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      // console.log("-----> google strategy callback fn called");
      console.log(profile);
      const foundUser = await prisma.users.findFirst({
        where: { authId: profile.id },
      });

      if (foundUser != null) {
        done(null, foundUser);
        // console.log("user already existr in verify fn");
        // console.log(foundUser, "foundUser->>>");
      } else {
        // console.log("creating new user in verify fn");
        const newUser = await prisma.users.create({
          data: {
            username: profile.displayName,
            authProvider: "github",
            authId: profile.id,
            profilePic: profile._json.avatar_url,
            email: "",
          },
        });
        done(null, newUser);
      }
    }
  )
);
