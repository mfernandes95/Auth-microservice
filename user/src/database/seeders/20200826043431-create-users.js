const bcrypt = require("bcryptjs");

module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      "users",
      [
        {
          name: "user",
          email: "user@email.com",
          password_hash: bcrypt.hashSync("123456", 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "matheus",
          email: "matheus@gmail.com",
          password_hash: bcrypt.hashSync("123456", 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => queryInterface.bulkDelete("users", null, {}),
};
