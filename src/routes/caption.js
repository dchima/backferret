import { Router as expressRouter } from 'express';
import { ApiMiddleware } from '../middlewares';
import { CaptionController } from '../controllers';

const {
  captionCheck, idCheck, captionAndTagsCheck, tagQueryCheck,
} = ApiMiddleware
const {
  createCaption, TagCaption, getCaptions, createCaptionWithTags, getCaptionsWithTag,
} = CaptionController;

const router = expressRouter();

router.post('/', captionCheck, createCaption);
router.post('/add-tag', idCheck, TagCaption);
router.post('/multi', captionAndTagsCheck, createCaptionWithTags);
router.get('/', getCaptions);
router.get('/withTag', tagQueryCheck, getCaptionsWithTag);

export default router;