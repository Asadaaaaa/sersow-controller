/**
 * A helper class for creating response presets.
 */
class ResponsePreset {
  /**
   * Returns a successful response object.
   * @param {string} message - The message to include in the response.
   * @param {object} [data=null] - The data to include in the response.
   * @returns {object} - The response object.
   */
  resOK(message, data) {
    return {
      status: 200,
      message,
      data: data || null
    };
  }

  /**
   * Returns an error response object.
   * @param {number} status - The HTTP status code to include in the response.
   * @param {string} message - The message to include in the response.
   * @param {string} type - The type of error.
   * @param {object} [data=null] - The data to include in the response.
   * @returns {object} - The response object.
   */
  resErr(status, message, type, data) {
    return {
      status,
      message,
      err: {
        type,
        data: data || null
      }
    };
  }
}

export default ResponsePreset;