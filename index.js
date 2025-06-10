import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { mongoDbConnection } from "./DB/DB.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import EventRoutes from "./routes/EventRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";

const app = express();

dotenv.config({ path: "./config/.env" });
// Start Server
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoDbConnection(MONGO_URI);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // dev log
}

app.use("/api", EventRoutes);
app.use("/api", UserRoutes);
app.get("/", (req, res) => {
  res.send("hii from server");
});
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
