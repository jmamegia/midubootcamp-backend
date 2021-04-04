const ERORRS = {
  CastError: (res) => res.status(400).send(),
  ValidationError: (res, { message }) =>
    res.status(409).json({ error: message }),
  JsonWebTokenError: (res) =>
    res.status(401).json({ error: "token is missing or invalid" }),
  TokenExpiredError: (res) => res.status(401).json({ error: "token expired" }),
  defaultError: (res) => res.status(500).emd(),
};

module.exports = (err, req, res, next) => {
  const error = ERORRS[err] || ERORRS.defaultError;
  error(err, res);
};
