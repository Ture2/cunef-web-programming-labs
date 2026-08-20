/*
  src/lib/asyncHandler.js — Riverside FC example (Session 27)
  Express 4 does not catch errors thrown from async handlers. This wrapper
  forwards any rejected promise to next(err) so the central error handler runs.
*/

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { asyncHandler };
