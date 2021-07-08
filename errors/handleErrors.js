exports.handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message, name } = err;
  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
      name,
    });
  return next();
};
