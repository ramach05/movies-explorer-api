exports.handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message, name } = err;
  res
    .status(statusCode)
    .send({
      message,
      name,
    });
  return next();
};
