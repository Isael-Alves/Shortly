import { Router } from 'express';
import { urlsShorten } from '../controllers/shortUrlsController.js';


const router = Router();

router.post('/urls/shorten', urlsShorten);
// router.get('/urls/:id', );
// router.get('/urls/open/:shortUrl', );
// router.delete('/urls/:id', );

export default router;