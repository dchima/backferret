import { Router as expressRouter } from 'express';
import { ApiMiddleware } from '../middlewares';
import { TagController } from '../controllers';

const {
  tagCheck, captionAndTagIdCheck,
} = ApiMiddleware
const {
  createTag, getTags, getCaptionsByTagIds,
} = TagController;

const router = expressRouter();

router.post('/', tagCheck, createTag);
router.get('/', getTags);
router.post('/tagIds', captionAndTagIdCheck, getCaptionsByTagIds);

export default router;