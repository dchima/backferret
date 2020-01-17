import { Helpers } from '../utils'
import { TagService } from '../services';

const {
  newTag, getAllTags, captionsWithMultipleTags
} = TagService;
const {
  successResponse, errorResponse,
} = Helpers;
/**
 * Collection of methods to control captions
 * @class TagController
 */
export default class TagController {
  /**
   * Add new caption
 * @static
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof TagController
   */
  static async createTag(req, res) {
    console.log('in controller');
    try {
      const { tag } = req.body;
      const value = await newTag({ tag });
      return successResponse(res, value, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }


  /**
   * get all tags
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof TagController
   */
  static async getTags(req, res) {
    try {
      const allTags = await getAllTags();
      const tags = allTags.map((items) => items.tag);
      if (!allTags.length) return errorResponse(res, { code: 404, message: 'There are no tags' });
      return successResponse(res, { tags });
    } catch (error) {
      errorResponse(res, {});      
    }
  }

  /**
   * get caption with multiple tags
   * @param {Request} req - The request endpoint
   * @param {Response} res - the response endpoint
   * @return {JSON} -JSON response
   * @memberof CaptionController
   */
  static async getCaptionsByTags(req, res) {
    const { tags } = req.body;
    try {
      let allCaptions = [];
      let captions = [];
      const captionsInDatabase = await captionsWithMultipleTags({ tag: tags });
      captionsInDatabase.forEach((item) => {
        item.captions.forEach((value) => {
          allCaptions.push(value.caption);
        })
      });
      let unique = [...new Set(allCaptions)];
      unique.forEach((value) => {
        captions.push({
          caption: value,
          numberOfTags: allCaptions.filter((str) => str === value).length
        });
      });
      captions.sort((a, b) => b.numberOfTags - a.numberOfTags );
      successResponse(res, { captions }, 200);
    } catch (error) {
      errorResponse(res, {});
    }
  }
}
