import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { query } from "./api/Conversation";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function eventHandlers(req: Request, res: Response, next: any) {}

app.post("/api/conversation", query);
