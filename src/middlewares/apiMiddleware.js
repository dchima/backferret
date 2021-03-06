import { ApiValidations } from '../validations';
import { CaptionService, TagService } from '../services';
import { Helpers } from '../utils';

const {
  errorResponse,
} = Helpers;
const {
  validateCaption, validateTag, validateId, validateIds, validateCaptionAndTags,
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
  static async captionAndTagsCheck(req, res, next) {
    const { caption, tags } = req.body;
    try {
      const captionInDatabase = await findCaption({ caption });
      if(captionInDatabase) return errorResponse(res, { code: 404, message: 'This caption already exists' });
      validateCaptionAndTags(req.body);
      const tagsInDatabase = await findMultipleTags({ tag: tags });
      let foundAllTags = true;
      tags.forEach((tag) => {
        const found = tagsInDatabase.find((item) => item.tag === tag);
        if (found === undefined) foundAllTags = false;
      });
      if (!foundAllTags) return errorResponse(res, { code: 400, message: 'one of the tags does not exist' });
      req.tags = [];
      tagsInDatabase.forEach((items) => {
        console.log('item ids:', items.id);
        req.tags.push({ tagId: items.id });
      });
      console.log('tagIds: ', req.tags);
      next();
    } catch (error) {
      errorResponse(res, {code: 400, message: error.details[0].context.label});
    }
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static async checkTagArray(req, res, next) {
    try {
      const { tags } = req.body;
      validateTagArray(req.body);
      const tagsInDatabase = await findMultipleTags({ tag: tags });
      let foundAllTags = true;
      tags.forEach((tag) => {
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
