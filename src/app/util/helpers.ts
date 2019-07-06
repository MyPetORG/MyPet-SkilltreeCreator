export function setDefault(object: object, field: string, value: any) {
  if (typeof value !== 'undefined') {
    object[field] = value;
  }
}

export function matchOrDefault(value: string, patter, def: any) {
  if (value && value.match(patter)) {
    return value;
  }
  return def;
}
