import {Router as expressRouter} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import captionRoutes from './caption';
import tagRoutes from './tag';

const router = expressRouter();
router.use('/caption', captionRoutes);
router.use('/tag', tagRoutes);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
