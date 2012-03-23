String.prototype.toSlug = function() {
  return this.match(/([\-a-zA-Z]+)/gi).join('-')
}
