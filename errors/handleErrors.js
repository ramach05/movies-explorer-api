exports.handleErrors = (err, req, res, next) => {
  res
    .status(err.statusCode)
    .send({
      message: err.message,
    });
  return next();
};
