import joi from '@hapi/joi';

/**
 * This class holds methods for validating caption object
 * @class ApiValidations
 */
export default class ApiValidations {
  /**
   * validate caption inputs
   * @param {object} object - The input caption parameter
   * @return {object | boolean} - returns an object or boolean
   * @memberof ApiValidations
   */
  static validateCaption(object) {
    const schema = {
      caption: joi.string().min(3).max(100).required()
      .label('Please enter a caption more than 3 characters, less than 100'),
    };
    const {error} = joi.validate({...object}, schema);
    if (error) {
      throw error;
    }
    return true;
  }

  /**
   * vlidate tag inputs
   * @param {object} object - The input tag parameter
   * @return {object | boolean} - returns an object or boolean
   * @memberof ApiValidations
   */
  static validateTag(object) {
    const schema = {
      tag: joi.string().min(3).max(30).regex(/^[a-z]+$/).required()
      .label('Please enter a tag more than 3 characters, less than 30, lowercase letters'),
    };
    const {error} = joi.validate({...object}, schema);
    if (error) {
      throw error;
    }
    return true;
  }

  /**
   * vlidate an id
   * @param {object} object - The input id parameter { id: 5 }
   * @return {object | boolean} - returns an object or boolean
   * @memberof ApiValidations
   */
  static validateId(object) {
    const schema = {
      id: joi.number().positive().required().label('Please enter a positive number'),
    };
    const {error} = joi.validate({...object}, schema);
    if (error) {
      throw error;
    }
    return true;
  }

  /**
   * validate tags/captions ids
   * @param {object} object - The input tag parameter
   * @return {object | boolean} - returns an object or boolean
   * @memberof ApiValidations
   */
  static validateIds(object) {
    const schema = {
      captionId: joi.number().positive().required().label('Please enter a positive number'),
      tagId: joi.number().positive().required().label('Please enter a positive number'),
    };
    const {error} = joi.validate({...object}, schema);
    if (error) {
      throw error;
    }
    return true;
  }


    /**
   * validate tags/captions ids
   * @param {object} object - The input tag parameter
   * @return {object | boolean} - returns an object or boolean
   * @memberof ApiValidations
   */
  static validateTagArray(object) {
    const schema = {
      tagArray: joi.array().items(joi.string().required().label('all values in array must be a string')),
    };
    const {error} = joi.validate({...object}, schema);
    if (error) {
      console.log(error.details[0].context);
      throw error;
    }
    return true;
  }

  /**
   * validate caption string and tag ids
   * @param {object} payload - object to be validated
   * @returns {object | boolean} - returns an error object or valid boolean
   * @memberof ApiValidations
   */
  static validateCaptionAndTagIds(payload) {
    const tagObject = joi.object().keys({
      tagId: joi.number().integer().min(1).label('Please enter a positive tag id number'),
    });
    const tags = joi.array().items(tagObject);
    const schema = {
      caption: joi.string().min(3).max(100).required()
      .label('Please enter a caption more than 3 characters, less than 100'),
      tags,
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error;
    return true;
  }
  
}