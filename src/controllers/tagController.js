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
      if (!allTags.length) return errorResponse(res, { code: 404, message: 'There are no tags' });
      return successResponse(res, { allTags });
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
  static async getCaptionsByTagIds(req, res) {
    const { tagIds, tagArray } = req.body;
    try {
      let allCaptions = [];
      const captionsInDatabase = await captionsWithMultipleTags({ tag: tagArray });
      captionsInDatabase.forEach((item) => {
        item.captions.forEach((value) => {
          allCaptions.push(value.caption);
        })
      });
      let unique = [...new Set(allCaptions)];
      let duplicates = unique.map((value) => [{ 
        caption: value, 
        numberOfTags: allCaptions.filter((str) => str === value).length 
      }]);
      successResponse(res, { duplicates }, 200);
    } catch (error) {
      errorResponse(res, {});
    }
  }
}
