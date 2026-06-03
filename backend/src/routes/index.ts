// Master index file

import express from "express";
import leadRoute from "./lead.routes.js";

const router = express.Router();

router.use("/customer", leadRoute);

export default router;
