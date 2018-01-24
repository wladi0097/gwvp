/* global localStorage */
/**
 * Save JS-objects in the localstorage
 */
const localStorages = {
  /** Save a object into the localstorage
   * @param {String} name - name of the localstorage cell
   * @param {Object} data - data to save
   * @return {Boolean} false if there was a error
  */
  new (name, data) {
    try {
      data = JSON.stringify(data)
      localStorage.setItem(name, data)
    } catch (e) {
      return false
    }
  },

  /** Returns the data by a name
   * @param {String} name - name of the localstorage cell
   * @return {Object} stored data
  */
  get (name) {
    return JSON.parse(localStorage.getItem(name))
  },

  /** Deletes a localstorage cell
   * @param {String} name - name of the localstorage cell
   * @return {Boolean} false if there was a error
  */
  del (name) {
    try {
      localStorage.removeItem(name)
    } catch (e) {
      return false
    }
  },

  /** Replace current data
   * @param {String} name - name of the localstorage cell
   * @param {Object} data - data to save
   * @return {Boolean} false if there was a error
  */
  replace (name, inhalt) {
    try {
      this.del(name)
      this.new(name, inhalt)
    } catch (e) {
      return false
    }
  },

  /** Check if data exists
   * @param {String} name - name of the localstorage cell
   * @return {Boolean} true if exists
  */
  exist (name) {
    return (this.get(name) !== null)
  }
}

module.exports = localStorages
