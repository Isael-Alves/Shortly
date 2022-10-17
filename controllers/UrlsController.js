import db from "../database/db.js";
import { nanoid } from "nanoid";

async function urlsShorten(req, res) {
  const { url } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Nenhum token passado!");
  }
  try {
    if (!url) {
      return res.status(422).send("URL underfined!");
    }

    const validationURL =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    if (!url.match(validationURL)) {
      return res.status(422).send("URL invalida!");
    }

    const sessions = await db.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );
    const userId = sessions.rows[0].userId;

    if (sessions.rowCount === 0) {
      return res.status(401).send("Token invalido");
    }

    const user = await db.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
    if (user.rowCount === 0) {
      return res.status(401).send("Usuário invalido");
    }
    const shortUrl = nanoid(9);

    db.query(`INSERT INTO urls(url, "shortUrl", "userId")VALUES ($1, $2, $3)`, [
      url,
      shortUrl,
      userId,
    ]);

    return res.status(201).send({ shortUrl });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function getConsultSessions(req, res) {
  const sessionId = req.params;
  try {
    const { rows, rowCount } = await db.query(
      "SELECT * FROM urls WHERE id = $1",
      [sessionId.id]
    );
    if (rowCount === 0) {
      return res.status(404).send("url não encontrada!");
    }
    const { id, shortUrl, url } = rows[0];

    return res.send({ id, shortUrl, url });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function openShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const { rowCount, rows } = await db.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1`,
      [shortUrl]
    );

    if (rowCount === 0) {
      return res.sendStatus(404);
    }
    const visitCount = rows[0].visitCount;
    const url = rows[0].url;

    await db.query(
      `UPDATE urls SET "visitCount"='${visitCount + 1}' WHERE "shortUrl" = $1;`,
      [shortUrl]
    );

    return res.redirect(url);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function deleteUrl(req, res) {
  const { id } = req.params;
  const { user } = res.locals;

  try {
    const { rows, rowCount } = await db.query(
      "SELECT * FROM urls WHERE id = $1",
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).send("Url não existente!");
    }
    const url = rows[0];
    
    if (url.userId !== user[0].id) {
      return res.sendStatus(401);
    }

    await db.query('DELETE FROM urls WHERE id=$1', [id]);

    return res.status(204).send("Url excluída!");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export { urlsShorten, getConsultSessions, openShortUrl, deleteUrl };
