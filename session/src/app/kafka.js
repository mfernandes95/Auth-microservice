import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "api",
  brokers: ["kafka:29092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

module.exports = kafka;
