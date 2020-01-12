import { Router as expressRouter } from 'express';
import { ApiMiddleware } from '../middlewares';
import { CaptionController } from '../controllers';

const {
  captionCheck, idCheck, captionAndTagIdCheck, tagQueryCheck,
} = ApiMiddleware
const {
  createCaption, TagCaption, getCaptions, createCaptionWithTags, getCaptionsWithTag,
} = CaptionController;

const router = expressRouter();

router.post('/', captionCheck, createCaption);
router.post('/add-tag', idCheck, TagCaption);
router.post('/multi', captionAndTagIdCheck, createCaptionWithTags);
router.get('/', getCaptions);
router.get('/withTag', tagQueryCheck, getCaptionsWithTag);

export default router;