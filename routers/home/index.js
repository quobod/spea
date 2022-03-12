import { Router } from "express";
import { getLanding } from "../../controllers/home/index.js";
import { signedOut } from "../../middleware/AuthMiddleware.js";

const landing = Router();

// home route
landing.route("/").get(signedOut, getLanding);

export default landing;
