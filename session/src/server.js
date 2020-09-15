const swaggerJsDoc = require("./swagger.json");
const swaggerUi = require("swagger-ui-express");

import routes from "./routes";
const app = require("./app");

import kafka from "./kafka";
// const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "certificate-group-receiver" });

/**
 * Disponibiliza o producer para todas rotas
 */
app.use((req, res, next) => {
  req.producer = producer;
  req.consumer = consumer;

  return next();
});

/**
 * Cadastra as rotas da aplicação
 */
app.use(routes);

// app.listen(3332);

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "certification-response" });

  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
  //     console.log("Resposta", String(message.value));
  //   },
  // });

  app.listen(3332);
}

run().catch(console.error);
