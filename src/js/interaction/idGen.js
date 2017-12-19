const idGen = {
  get () {
    return this.idGenerator() + this.idGenerator() +
    '-' + this.idGenerator() + '-' + this.idGenerator() + '-' +
    this.idGenerator() + '-' + this.idGenerator() + this.idGenerator() +
    this.idGenerator()
  },

  idGenerator () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
}

module.exports = idGen
