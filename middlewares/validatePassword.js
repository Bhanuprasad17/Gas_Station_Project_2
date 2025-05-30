function validatePasswordMiddleware(req, res, next) {
  const { password } = req.body;

  const isLengthValid = password && password.length >= 6;
  const hasCapitalLetter = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!isLengthValid || !hasCapitalLetter || !hasSymbol) {
    return res.status(400).json({
      message:
        "Password must be at least 6 characters long, include one capital letter, and one special character.",
    });
  }
  next();
}

module.exports = validatePasswordMiddleware;
