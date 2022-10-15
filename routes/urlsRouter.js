import { Router } from 'express';
import { getConsultSessions, urlsShorten, openShortUrl } from '../controllers/shortUrlsController.js';
import urlSchema from '../schemas/schemaURL.js';
import validateSchema from '../middlewares/valitationMiddleware.js';


const router = Router();

router.post('/urls/shorten', validateSchema(urlSchema), urlsShorten);
router.get('/urls/:id', getConsultSessions);
router.get('/urls/open/:shortUrl', openShortUrl);
// router.delete('/urls/:id', );

export default router;