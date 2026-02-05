const authservice = require('../services/auth.service')

const isUserAuthenticated = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  console.log (token);

  if (!token) {
    return res.status(401).json({
      msg: "Token not provided",
    });
  }

  try {
    const decoded = await authservice.verfiyJwtToken(token);

    if (!decoded) {
      return res.status(401).json({
        msg: "Token not verified",
      });
    }

    req.user = { 
      id: decoded.id,
      roles: decoded.roles
     };


    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      msg: "Invalid or expired token",
    });
  }
};

module.exports = {
  isUserAuthenticated,
};