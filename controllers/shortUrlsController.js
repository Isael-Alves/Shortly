import db from "../database/db.js";
import { nanoid } from 'nanoid';

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

        const shortURL = nanoid(9);
        return res.status(201).send({ shortURL });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export { urlsShorten };
