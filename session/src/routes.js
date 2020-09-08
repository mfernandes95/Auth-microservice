const routes = require("express").Router();

const authMiddleware = require("./app/middlewares/auth");

const SessionController = require("./app/controllers/SessionController");

import { CompressionTypes } from "kafkajs";

routes.post("/sessions", SessionController.store);

routes.post("/certifications", async (req, res) => {
  const message = {
    user: { id: 1, name: "Diego Fernandes" },
    course: "Kafka com Node.js",
    grade: 10,
  };

  // Chamar micro serviço
  await req.producer.send({
    topic: "issue-certificate",
    compression: CompressionTypes.GZIP,
    messages: [
      { value: JSON.stringify(message) },
      {
        value: JSON.stringify({
          ...message,
          user: { ...message.user, name: "Pellizzetti" },
        }),
      },
    ],
  });

  return res.json({ ok: true });
});

// routes.use(authMiddleware);

module.exports = routes;
