import db from "../database/db.js";
import bcrypt, { compareSync } from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const { rowCount } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (rowCount > 0) {
      return res.status(409).send("Email já existente");
    }

    const newPassword = bcrypt.hashSync(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, newPassword]
    );

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const { rows, rowCount } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (rowCount === 0) {
      return res.status(401).send("Email não existente");
    }

    const passwordHash = rows[0].password;
    const isCompatible = compareSync(password, passwordHash);

    if (!isCompatible) {
      return res.status(401).send("Senha incorreta.");
    }

    const token = uuid();
    const userId = rows[0].id;

    const user = await db.query(`SELECT * FROM sessions WHERE "userId" = $1;`, [
      userId,
    ]);

    if (user.rows > 0) {
      const id = user.rows[0].id;

      if (user.rowCount > 0) {
        await db.query(`UPDATE sessions SET token='${token}'  WHERE id=${id};`);
      }
      return res.status(200).send({ token });
    }

    await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [
      token,
      userId,
    ]);

    return res.status(200).send({ token });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}