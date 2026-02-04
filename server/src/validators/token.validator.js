const { StatusCodes } = require("http-status-codes");
const { userSchema } = require("./schema.validator");

const checkUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    console.log(errMsg);

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: errMsg
    });
  }

  next();
};

module.exports = { checkUser };
