import db from '../models';

const { Caption, CaptionTag, sequelize } = db;

/**
 * Service class for Caption db
 * @class CaptionService
 */
export default class CaptionService {
  /**
   * Add new caption to database
   * @static
   * @param {object} caption - The caption to be added to database
   * @return {Promise-Object} A promise object with caption detail.
   * @memberof CaptionService
   */
  static async newCaption(caption) {
    try {
      const {dataValues: value} = await Caption.create(caption);
      return value;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * find a caption by id
   * @param {object} id - object containing id
   * @returns {promise-Object} - A promise object with caption details
   * @memberof CaptionService
   */
  static async findCaptionById(id) {
    return Caption.findByPk(id, { include: ['tags'] });
  }

  /**
   * find a caption
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with tag details
   * @memberof CaptionService
   */
  static async findCaption(keys) {
    console.log('key: ', keys);
    return Caption.findOne({ where: keys });
  }

  /**
   * Add tag to caption
   * @static
   * @param {object} payload - { captionId, tagId}
   * @return {Promise-Object} A promise object with caption detail.
   * @memberof CaptionService
   */
  static async addTagToCaption(payload) {
    try {
      const { dataValues: value } = await CaptionTag.create(payload);
      return value;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * get all captions
   * @returns {promise-Object} - A promise object with all tags
   * @memberof CaptionService
   */
  static async getAllCaptions() {
    const captions = await Caption.findAll({
    attributes: ['id', 'caption'], where: {}
    });
    return captions;
  }

  /**
   * create caption with multiple tags
   * @static
   * @param {object} payload - data to be recorded in the database.
   * @returns {Promise<object>} A promise object with caption detail.
   * @memberof CaptionService
   */
  static async newCaptionWithTags(payload) {
    const { caption, tags } = payload;
    console.log('caption: ', caption);
    console.log('tags: ', tags);
    try {
      const result = await sequelize.transaction(async () => {
        const { id: captionId } = await Caption.create({ caption });
        const updateData = [...tags];
        updateData.forEach((items) => {
          items.captionId = captionId;
        });
        await CaptionTag.bulkCreate(updateData);
        const value = await CaptionService.findCaptionById(captionId);
        return value;
      });
      return result;
    } catch (error) {
      console.log('error:', error);
      throw new Error(error);
    }
  }
}
