const encryption = require("../utilities/crypto-utils");

const authorizationMiddleware = async (req, res, next) => {
  const isPublic = req.originalUrl.toLowerCase().includes('/public');
  if (isPublic) {
    next();
    return;
  }
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const userID = encryption.decryptToken(req.headers.authorization);
    req.userid = userID; // Attach user ID to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authorizationMiddleware;

