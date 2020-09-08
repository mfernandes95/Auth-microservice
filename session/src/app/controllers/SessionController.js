const { User } = require("../models");
const { CompressionTypes } = require("kafkajs");

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

      // console.log("CONSSSSSS=================", req.consumer);
      // await req.consumer.run({
      //   eachMessage: async ({ topic, partition, message }) => {
      //     console.log("Resposta", String(message.value));
      //   },
      // });

      return res.json({ ok: true });

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
