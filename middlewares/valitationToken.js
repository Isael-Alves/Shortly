import db from '../database/db.js';

async function valitationToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Nenhum token encontrado.");
  }

  try {
    const sessions = await db.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );
    
    const { userId } = sessions.rows[0];

    if (sessions.rowCount === 0) {
       return res.status(401).send("Sessão das urls não encontrada.");
    }

    const user = await db.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
    if (user.rowCount === 0) {
      return res.status(401).send("Usuário não encontrado");
    }

    res.locals.user = user.rows;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // server error
  }
}

export default valitationToken;