import { ApiValidations } from '../validations';
import { CaptionService, TagService } from '../services';
import { Helpers } from '../utils';

const {
  errorResponse,
} = Helpers;
const {
  validateCaption, validateTag, validateId, validateIds, validateCaptionAndTagIds,
  validateTagArray
} = ApiValidations;
const {
  findCaption,
} = CaptionService
const {
  findTag, findMultipleTags,
} = TagService
/**
 * Middleware for captions api
 * @class ApiMiddleware
 */
export default class ApiMiddleware {
 /**
   * validate caption
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - the returned values
   * @return {object} - returns and object {error or next}
   */
  static async captionCheck(req, res, next) {
    try {
      console.log('in middleware');
      let caption = req.body.caption.toLowerCase();
      caption = await findCaption({ caption });
      if(caption) return errorResponse(res, { code: 404, message: 'This caption already exists' });
      const validated = validateCaption(req.body);
      if (validated) {
        next();
      }
    } catch (error) {
      errorResponse(res, {code: 400, message: error.details[0].context.label});
    }
  }

  /**
   * validate tag
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - the returned values
   * @return {object} - returns and object {error or next}
   */
  static async tagCheck(req, res, next) {
    try { 
      const validated = validateTag(req.body);
      if (validated) {
        next();
      }
    } catch (error) {
      errorResponse(res, {code: 400, message: error.details[0].context.label});
    }
  }

  /**
   * validate caption and tag ids
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - the returned values
   * @return {object} - returns and object {error or next}
   */
  static async idCheck(req, res, next) {
    try {
      const { captionId, tagId } = req.body;
      validateIds(req.body);
      const caption = await findCaption({ id: captionId });
      if (!caption) return errorResponse(res, { code: 404, message: `caption with an id of ${captionId} does not exist in our database` });
      const tag = await findTag({ id: tagId });
      if (!tag) return errorResponse(res, { code: 404, message: `tag with an id of ${tagId} does not exist in our database` });
      next();
    } catch (error) {
      errorResponse(res, {code: 400, message: error.details[0].context.label});
    }
  }

  /**
   * validate caption with tags
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - the returned values
   * @return {object} - returns and object {error or next}
   */
  static async captionAndTagIdCheck(req, res, next) {
    const { tags } = req.body;
    let tagIds;
    let tagArray;
    try {
      if(req.body.tags){
        const caption = await findCaption({ caption: req.body.caption });
        if(caption) return errorResponse(res, { code: 404, message: 'This caption already exists' });
        validateCaptionAndTagIds(req.body);
        tagIds = tags.map((items) => items.tagId);
        console.log('tag ids: ', tagIds);
      } else {
        //tagIds = req.body.tagIds;
        tagArray = req.body.tagArray;
        validateTagArray({ tagArray });
      }
      const tagsInDatabase = await findMultipleTags({ tag: tagArray });
      let foundAllTags = true;
      tagArray.forEach((tag) => {
        const found = tagsInDatabase.find((item) => item.tag === tag);
        if (found === undefined) foundAllTags = false;
      });
      if (!foundAllTags) return errorResponse(res, { code: 400, message: 'one of the tags does not exist' });
      next();
    } catch (error) {
      errorResponse(res, {code: 400, message: error.details[0].context.label});
    }
  }

  /**
   * validate tage in query
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - the returned values
   * @return {object} - returns and object {error or next}
   */
  static async tagQueryCheck(req, res, next) {
    const { tagId } = req.query;
    try {
      const validated = validateId({ id: tagId });
      if(validated) {
       next();
      }
    } catch (error) {
      errorResponse(res, {code: 400, message: error.details[0].context.label});
    }
  }
}
