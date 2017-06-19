const generateCacheKey = (ID, query) => {
  const items = [ID];
  Object.keys(query).forEach((key) => {
    items.push(query[key]);
  });
  return items.join('-');
};

module.exports = {
  generateCacheKey
};
