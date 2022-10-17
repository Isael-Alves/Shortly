import db from "../database/db.js";

async function getMyUser(req, res) {
  const { user } = res.locals;
  const { id, name } = user[0];

  try {
    const { rows } = await db.query(`SELECT * FROM urls WHERE "userId" = $1`, [
      id,
    ]);
    const result = await db.query(
      `SELECT SUM(u."visitCount") FROM urls u WHERE "userId" = $1`,
      [id]
    );
    const visitCount = result.rows[0].sum;

    const shortenedUrls = rows;
    shortenedUrls.map((user) => {
      delete user.userId;
      delete user.createdAt;
    });

    return res.send({ id, name, visitCount, shortenedUrls });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export default getMyUser;
