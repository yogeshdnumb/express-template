import express from "express";
import passport from "passport";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("login");
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    console.log("logged out inside logout");
  });
  console.log("logged out");
  res.redirect(`${process.env.FRONTEND_URL}/`);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/`);
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get("/github/redirect", passport.authenticate("github"), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/`);
});

router.get("/user", isAuthenticated, (req, res) => {
  res.status(200).send(req.user);
});

export default router;
