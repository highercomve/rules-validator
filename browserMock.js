Object.defineProperty(document, 'domain', {
  value: 'localhost'
})

global.sessionStorage = {
  storage: {},
  setItem: function (field, value) {
    this.storage[field] = value
  },
  getItem: function (field) {
    return this.storage[field]
  },
  removeItem: function (field) {
    this.storage[field] = null
  }
}
