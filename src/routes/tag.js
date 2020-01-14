import { Router as expressRouter } from 'express';
import { ApiMiddleware } from '../middlewares';
import { TagController } from '../controllers';

const {
  tagCheck, checkTagArray,
} = ApiMiddleware
const {
  createTag, getTags, getCaptionsByTags,
} = TagController;

const router = expressRouter();

router.post('/', tagCheck, createTag);
router.get('/', getTags);
router.post('/array', checkTagArray, getCaptionsByTags);

export default router;