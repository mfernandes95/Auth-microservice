import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["kafka:29092"],
  clientId: "certificate",
});

export default kafka;
