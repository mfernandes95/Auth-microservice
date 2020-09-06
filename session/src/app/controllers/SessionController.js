const { User } = require("../models");
const { CompressionTypes } = require("kafkajs");

class SessionController {
  async store(req, res) {
    try {
      console.log("MQQQQQQ");

      const { email, password } = req.body;

      // -------------
      console.log("REQQ", req.body);
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

      return res.send({ ok: true });

      // const user = await User.findOne({ where: { email } });

      // if (!user) return res.status(401).json({ message: "User not found" });

      // if (!(await user.checkPassword(password)))
      //   return res.status(401).json({ message: "Incorrect credentials" });

      // return res.status(200).send({ user, token: user.generateToken() });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new SessionController();
