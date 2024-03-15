import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    version: "1.0.0",
    author: "gabrielalberini",
  });
});

app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
