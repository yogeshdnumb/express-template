export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    console.log("authenticated");
    next();
  } else {
    console.log("not authenticated");

    res.status(401).send("Unauthorized");
  }
}
