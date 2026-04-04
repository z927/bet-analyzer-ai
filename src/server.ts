import express from "express";
import actuator from "express-actuator";
import analyzeRouter from "./routes/analyzer-route";

const app = express();

app.use(express.json());
app.use(actuator());
app.use("/api", analyzeRouter);

const PORT: string | number = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server TypeScript avviato sulla porta ${PORT}`);
});
