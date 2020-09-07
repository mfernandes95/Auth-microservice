import express from "express";
const swaggerJsDoc = require("./swagger.json");
const swaggerUi = require("swagger-ui-express");
import { Kafka, logLevel } from "kafkajs";

import routes from "./routes";
const app = require("./app");

// const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

/**
 * Faz conexão com o Kafka
 */
const kafka = new Kafka({
  clientId: "api",
  brokers: ["kafka:29092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "certificate-group-receiver" });

/**
 * Disponibiliza o producer para todas rotas
 */
app.use((req, res, next) => {
  req.producer = producer;

  return next();
});

/**
 * Cadastra as rotas da aplicação
 */
app.use(routes);

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "certification-response" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Resposta", String(message.value));
    },
  });

  app.listen(3332);
}

run().catch(console.error);
