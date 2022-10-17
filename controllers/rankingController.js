import db from "../database/db.js";

async function getRanking(req, res) {
  try {
    const { rows } = await db.query(`
    SELECT users.id, users.name, COUNT(urls.id) as "linksCount", SUM(urls."visitCount") as "visitCount"
    FROM urls
    JOIN users ON urls."userId" = users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10
  `);
    const ranking = rows;
    return res.send(ranking);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export default getRanking;
