import express from "express";
import actuator from "express-actuator";
import analyzeRouter from "./routes/analyzer-route";
import telegramRouter from "./routes/telegram-router";
import pingRouter from "./routes/ping-router";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const swaggerDocument = YAML.load(
  path.join(__dirname, "../src/resources/openapi.yaml")
);
const PORT: string | number = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(actuator());
app.use("/", pingRouter);
app.use("/api/analyzer", analyzeRouter);
app.use("/api/telegram", telegramRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
