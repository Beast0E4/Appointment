const { StatusCodes } = require('http-status-codes');

module.exports.hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
    }

    const hasPermission = req.user.roles.some(role =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};
