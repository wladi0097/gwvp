/** @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * a simple id Generator
 */
const idGen = {
  /**
   * get a new unique id
   * @return {String} id
   */
  new () {
    return this.idGenerator() + this.idGenerator() +
    '-' + this.idGenerator() + '-' + this.idGenerator() + '-' +
    this.idGenerator() + '-' + this.idGenerator() + this.idGenerator() +
    this.idGenerator()
  },

  /** creates a random number sequence
    @return {String} number sequence
   */
  idGenerator () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
}

module.exports = idGen
