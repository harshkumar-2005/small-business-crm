import express from "express";
import { type Request, type Response } from "express";

import apiRouter from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response)=>{
    console.log("App is healthy.......");
    res.status(200).json({
        success: true,
        message: "App is healthy....."
    });
});

app.use("/v1/api/backend", apiRouter);

app.listen(8080, () => {
    console.log(`App is runnning at http://localhost:8080`);
});