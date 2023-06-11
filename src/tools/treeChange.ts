export function arrayObjectToObject(data: Array<any>): any {
  const result: any = {};

  for (const i of data) {
    if (i?.children?.length > 0) {
      i.children = arrayObjectToObject(i.children);
      result[i.name] = i;
    } else if (i?.button?.length > 0) {
      i.button = arrayObjectToObject(i.button);
      result[i.name] = i;
    } else result[i.name] = i;
  }

  return result;
}

export function objectToArrayObject(data: any): Array<any> {
  const result: Array<any> = [];

  for (const key in data) {
    if (Object.keys(data[key]?.children || {})?.length > 0) {
      data[key].children = objectToArrayObject(data[key].children);
      result.push(data[key]);
    } else if (Object.keys(data[key]?.button || {})?.length > 0) {
      data[key].button = objectToArrayObject(data[key].button);
      result.push(data[key]);
    } else result.push(data[key]);
  }

  return result;
}
