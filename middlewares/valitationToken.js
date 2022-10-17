import db from "../database/db.js";

async function valitationToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    if (!token) {
      return res.status(401).send("Nenhum token encontrado.");
    }

    const sessions = await db.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );

    if (sessions.rowCount === 0) {
      return res.status(404).send("Usuário encontrado.");
    }

    const { userId } = sessions.rows[0];
    const user = await db.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
    if (user.rowCount === 0) {
      return res.status(401).send("Usuário não encontrado");
    }

    res.locals.user = user.rows;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export default valitationToken;
