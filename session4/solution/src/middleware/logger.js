// Application-level middleware. Express calls it for every request with
// three arguments: the request, the response, and next — the function that
// passes control to the next middleware or route.
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

module.exports = logger;