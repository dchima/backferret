import db from '../models';

const {Tag, Caption, CaptionTag} = db;

/**
 * Service class for Caption db
 * @class TagService
 */
export default class TagService {
  /**
   * Add new tag to database
   * @static
   * @param {object} tag - The caption to be added to database
   * @return {Promise-Object} A promise object with caption detail.
   * @memberof TagService
   */
  static async newTag(tag) {
    try {
      const {dataValues: value} = await Tag.create(tag);
      return value;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * find a tag
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with tag details
   * @memberof TagService
   */
  static async findTag(keys) {
    return Tag.findOne({ where: keys });
  }

  /**
   * get captions from tag
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with tag details
   * @memberof TagService
   */
  static async getTagCaption(keys) {
    return Tag.findOne({ 
      where: keys,
      include: [{
        model: Caption,
        as: 'captions',
        required: false,
        attributes: ['caption'],
        through: {
          model: CaptionTag,
          attributes: [],
        }
      }],
      attributes: ['tag'],
    });
  }

   /**
   * Search for multiple tags
   * @param {object} query - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with meal details
   * @memberof TagService
   */
  static async findMultipleTags(query) {
    return Tag.findAll({ where: query });
  }

  /**
   * get all tags
   * @returns {promise-Object} - A promise object with all tags
   * @memberof TagService
   */
  static async getAllTags() {
      const tags = await Tag.findAll({
      attributes: ['id', 'tag'], where: {}
    });
    return tags;
  }

    /**
   * get captions with multiple tags
   * @static
   * @param {object} tagids - tagIds of captions
   * @returns {Promise<object>} A promise object with caption detail.
   * @memberof CaptionService
   */
  static async captionsWithMultipleTags(keys) {
    console.log('key: ', keys);
    try {
      const captions = await Tag.findAll({
        where: keys,
        include: [{
          model: Caption,
          as: 'captions',
          required: false,
          attributes: ['caption'],
          through: {
            model: CaptionTag,
            attributes: [],
          }
        }],
        attributes: ['tag'],
        }).map((values) => values.get({ plain: true }));
        return captions;
    } catch (error) {
      console.log('error:', error);
      throw new Error(error);
    }
  }
}
