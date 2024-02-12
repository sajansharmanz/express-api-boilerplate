/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

const asyncWrap = (fn) =>
  function asyncUtilWrap(req, res, next, ...args) {
    const fnReturn = fn(req, res, next, ...args);
    return Promise.resolve(fnReturn).catch(next);
  };

export default asyncWrap;
