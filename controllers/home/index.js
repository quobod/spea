import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
const logger = bunyan.createLogger({ name: "Landing Controller" });

// @desc        Home page
// @route       GET /
// @access      Public
export const getLanding = asyncHandler(async (req, res) => {
  logger.info(`Route: /`);

  try {
    res.render("landing/home", {
      title: process.env.SITE_NAME || "RMT",
      landing: true,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
});
