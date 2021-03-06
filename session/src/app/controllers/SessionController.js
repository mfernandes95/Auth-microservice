const { User } = require("../models");
const { CompressionTypes } = require("kafkajs");
const bcrypt = require("bcryptjs");

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      console.log("REQQ", req.body);

      const data = {
        email: email,
        password: password,
      };

      // Chamar micro serviçoss
      await req.producer.send({
        topic: "issue-certificate",
        compression: CompressionTypes.GZIP,
        messages: [{ value: JSON.stringify(data) }],
      });

      await req.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const compare = await bcrypt.compare(password, String(message.value));

          console.log("Resposta", String(message.value), compare);

          if (!compare)
            return res.status(401).json({ message: "Incorrect credentials" });

          return res.json({ token: String(message.value) });
        },
      });

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
