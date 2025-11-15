const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userExists = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "Email já registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
      );

      return res.status(201).json({ message: "Usuário registrado com sucesso" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (user.rows.length === 0) {
        return res.status(400).json({ message: "Usuário não encontrado" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (!isValidPassword) {
        return res.status(400).json({ message: "Senha incorreta" });
      }

      const token = jwt.sign(
        { id: user.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

    return res.json({
        success: true,
        message: "Login realizado com sucesso",
        token,
        user: {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
        }
    });


    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  }
};
