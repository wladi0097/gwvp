/* global localStorage */
/**
 * introduces JS-objects in the localstorage
 */
const localStorages = {
  /** save a object into the localstorage
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

  /** returns the data drom a name
   * @param {String} name - name of the localstorage cell
   * @return {Object} stored data
  */
  get (name) {
    return JSON.parse(localStorage.getItem(name))
  },

  /** deletes a localstorage cell
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

  /** replace current data
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

  /** replace current data
   * @param {String} name - name of the localstorage cell
   * @return {Boolean} true if exists
  */
  exist (name) {
    return (this.get(name) !== null)
  }
}

module.exports = localStorages
