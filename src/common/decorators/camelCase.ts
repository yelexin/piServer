import * as _ from 'lodash';
function snake2camelCase(str) {
  if (!str) return '';
  let key = str[0];
  for (let i = 1; i < str.length; i++) {
    if (str[i - 1] === '_') {
      key += str[i].toUpperCase();
    } else if (str[i] !== '_') {
      key += str[i];
    }
  }
  return key;
}
function dfs(item: object | Array<any>) {
  if (_.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      dfs(item[i]);
    }
  } else if (_.isObjectLike(item)) {
    const keys = Object.keys(item);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      const camelCaseKey = snake2camelCase(key);
      item[camelCaseKey] = item[key];
      if (camelCaseKey !== key) {
        delete item[key];
      }
      dfs(item[camelCaseKey]);
    }
  }
}
export function camelCase(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor,
) {
  let method = descriptor.value!;

  descriptor.value = async function () {
    const obj = await method.apply(this, arguments);
    // Object.keys(obj).forEach((key) => {
    //   const camelCaseKey = snake2camelCase(key);
    //   obj[camelCaseKey] = obj[key];
    //   delete obj[key];
    // });
    dfs(obj);
    return obj;
  };
}
