import { Helpers } from '../utils'
import { CaptionService, TagService } from '../services';

const {
  newCaption, addTagToCaption, getAllCaptions, newCaptionWithTags,
} = CaptionService;
const {
  getTagCaption
} = TagService;
const {
  successResponse, errorResponse,
} = Helpers;
/**
 * Collection of methods to control captions
 * @class CaptionController
 */
export default class CaptionController {
  /**
   * Add new caption
   * @static
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof CaptionController
   */
  static async createCaption(req, res) {
    console.log('in controller');
    try {
      let { caption } = req.body;
      caption = caption.toLowerCase();
      const value = await newCaption({ caption });
      return successResponse(res, value, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * Add tag to caption
   * @static
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof CaptionController
   */
  static async TagCaption(req, res) {
    const { captionId, tagId } = req.body;
    try {
      const value = await addTagToCaption({captionId, tagId });
      successResponse(res, { message: 'tag added to caption successfully', value });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get all captions
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof TagController
   */
  static async getCaptions(req, res) {
    try {
      let captions = await getAllCaptions();
      if (!captions.length) return errorResponse(res, { code: 404, message: 'There are no captions' });
      return successResponse(res, { captions });
    } catch (error) {
      errorResponse(res, {});      
    }
  }

  /**
   * create caption with multiple tags
   * This should allow the creation of a new caption
   * while aslo assigning 'existing tags' in databse to said caption
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof CaptionController
   */
  static async createCaptionWithTags(req, res) {
    let { caption, tags } = req.body;
    caption = caption.toLowerCase();
    const payload = {
      caption,
      tags,
    };
    try {
      const createdCaption = await newCaptionWithTags(payload);
      successResponse(res, { message: 'caption created', createdCaption }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get captions with tag
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof CaptionController
   */
  static async getCaptionsWithTag(req, res) {
    const { tagId } = req.query;
    try {
      const tagWithCaptions = await getTagCaption({ id: tagId });
      if (!tagWithCaptions) return errorResponse(res, { code: 404, message: `tag with an id of ${tagId} does not exist in our database` });
      let { tag, captions } = tagWithCaptions;
      captions = captions.map((items) => items.caption);
      successResponse(res, { tag, captions }, 200)
    } catch (error) {
      errorResponse(res, {});
    }
  }
}
