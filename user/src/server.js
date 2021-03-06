const swaggerJsDoc = require("./swagger.json");
const swaggerUi = require("swagger-ui-express");
import { Kafka } from "kafkajs";

const { User } = require("./app/models");

// import routes from "./routes";
const app = require("./app");

import kafka from "./kafka";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

const topic = "issue-certificate";
const consumer = kafka.consumer({ groupId: "certificate-group" });

const producer = kafka.producer();

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log("BAZINHA");
      console.log(`- ${prefix} ${message.key}#${message.value}`);

      const payload = JSON.parse(message.value);

      console.log("PAYYYYYYYYYY==============", payload);

      const userExists = await User.findOne({
        where: { email: payload.email },
      });

      console.log("USERRRRRR================", userExists);

      if (userExists) {
        // setTimeout(() => {
        producer.send({
          topic: "certification-response",
          messages: [
            {
              value: userExists.dataValues.password_hash,
            },
          ],
        });
        // }, 3000);
      }

      if (!userExists) {
        // setTimeout(() => {
        producer.send({
          topic: "certification-response",
          messages: [
            {
              value: `User not found`,
            },
          ],
        });
        // }, 3000);
      }
    },
  });

  app.listen(process.env.PORT || 3333);
}

run().catch(console.error);
