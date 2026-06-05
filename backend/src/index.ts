import express from "express";
import { type Request, type Response, type Application } from "express";
// import corsMiddleware from "./utils/corsConfiguration.js";
import apiRouter from "./routes/index.js";
import checkConnection from "./utils/dbConnection.js";

checkConnection();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(corsMiddleware);

app.use("/v1/api/backend", apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Application is running.......",
  });
});

app.get("/health", (req: Request, res: Response) => {
  console.log("App is healthy.......");
  res.status(200).json({
    success: true,
    message: "App is healthy.....",
  });
});

app.listen(3000, () => {
  console.log(`App is runnning at http://localhost:3000`);
});
