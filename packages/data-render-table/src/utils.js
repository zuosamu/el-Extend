import { isObject } from "./dataType";

export function getHandle(api) {
  const [handle, path = {}, fn = item => item] = api;
  return {
    handle,
    path,
    fn
  };
}
export function flatData(to, from) {
  if (!from) throw new Error("path结构和api数据结构有点对不上啊！老铁");
  let obj = Object.create(null);
  const toKeys = Object.keys(to);
  for (const i of toKeys) {
    if (from[i] instanceof Object && !Array.isArray(from[i])) {
      obj = {
        ...obj,
        ...flatData(to[i], from[i])
      };
    } else {
      obj[i] = from[to[i]];
    }
  }
  return obj;
}
export function requestStrategy(column) {
  const merge = {};
  const form = {};
  column.forEach(({ prop, strategy, $default }) => {
    merge[prop] = strategy;
    form[prop] = $default || "";
  });
  return {
    merge,
    form
  };
}

export function deepMerge(to, from) {
  for (const key in from) {
    to[key] = isObject(from[key]) ? deepMerge(to[key], from[key]) : from[key];
  }
  return to;
}
export function mergeInitConfig(to, from) {
  if (from === undefined) return to;
  const toKeys = Object.keys(to);
  for (const i of toKeys) {
    if (i === "$attr" || i === "$listener") {
      to[i] = { ...to[i], ...from[i] };
    } else if (i === "formItem") {
      to[i] = from[i].map(item => {
        const { method } = item;
        return deepMerge(
          { ...(to[i][method] || to[i].methodDefault) },
          { ...item }
        );
      });
    } else if (isObject(to[i])) {
      to[i] = mergeInitConfig(to[i], from[i]);
    } else if (from.hasOwnProperty(i)) {
      to[i] = from[i];
    }
  }
  return to;
}

export function structuralClone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}
