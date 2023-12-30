exports.filterObject = (obj, attributes) => {
  let result = {};
  attributes.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
};
