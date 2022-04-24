import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import passport from "passport";
import { body, check, validationResult } from "express-validator";
import User from "../../models/UserModel.js";
import { stringify, parse, createHash } from "../../custom_modules/index.js";
import { create } from "../../custom_modules/captcha.js";

const logger = bunyan.createLogger({ name: "Auth Controller" });

// @desc        signin user
// @route       POST /auth/signin
// @access      Public
export const signinUser = asyncHandler(async (req, res, next) => {
  logger.info(`Post: /auth/signin`);
  // console.log(passport);

  const { email, pwd } = req.body;
  console.log(`\n\tEmail: ${email}\tPassword: ${pwd}`);

  const captchaId = "captcha";
  const captchaFieldName = "captcha";
  const captcha = create({ cookie: captchaId });
  const captchaValid = captcha.check(req, req.body[captchaFieldName]);

  /* if (!captchaValid) {
    console.log(`\n\tCaptcha Invalid`);
    req.flash("error_msg", "Captcha Invalid");
    return res.redirect("/auth/signin");
  } else { */
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/auth/signin",
    failureFlash: true,
  })(req, res, next);
  // }
});

// @desc        User Signin
// @route       GET /auth/signin
// @access      Public
export const userSignin = asyncHandler(async (req, res) => {
  logger.info(`GET: /auth/signin`);

  const captchaUrl = "../../captcha.jpg";
  const captchaId = "captcha";
  const captchaFieldName = "captcha";
  const captcha = create({ cookie: captchaId });

  try {
    res.render("auth/signin", {
      title: "Signin",
      csrfToken: req.csrfToken,
      signin: true,
      // imgsrc: captchaUrl,
      // captchaFieldName,
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

// @desc        User Registration
// @route       GET /auth/signin
// @access      Public
export const userRegister = asyncHandler(async (req, res) => {
  logger.info(`GET: /auth/register`);

  /* const captchaUrl = "../../captcha.jpg";
  const captchaId = "captcha";
  const captchaFieldName = "captcha";
  const captcha = create({ cookie: captchaId }); */

  try {
    res.render("auth/register", {
      title: "Register",
      csrfToken: req.csrfToken,
      signup: true,
      // imgsrc: captchaUrl,
      // captchaFieldName,
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

// @desc        User Sign Out
// @route       GET /auth/signout
// @access      Private
export const userSignout = asyncHandler(async (req, res) => {
  logger.info(`GET: /auth/signout`);

  req.logout();
  delete req["user"];
  res.redirect("/");
});

// @desc        Register user
// @route       POST /auth/register
// @access      Public
export const registerUser = (req, res, next) => {
  logger.info(`Post: /auth/register`);

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };

  const captchaUrl = "/captcha.jpg";
  const captchaId = "captcha";
  const captchaFieldName = "captcha";
  const captcha = create({ cookie: captchaId });
  const captchaValid = captcha.check(req, req.body[captchaFieldName]);

  console.log(`Captcha Valid: ${captchaValid}`);
  // res.status(200).send({ status: captchaValid });

  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    // logger.error(`Registration Failure: ${JSON.stringify(result.array())}`);

    const err = result.array();
    console.log(err);
    const arrResult = [];

    for (const e in err) {
      const objE = err[e];
      const arrObjE = objE.split(":");
      const head = arrObjE[0];
      const value = arrObjE[1];
      const key = head.replace("body", "").replace("[", "").replace("]", "");
      const newObj = {};
      newObj[`${key}`] = value;
      arrResult.push(newObj);
    }

    console.log(`${stringify(arrResult)}\n`);

    return res.status(200).render("auth/register", {
      title: "Error",
      error: true,
      errors: arrResult,
    });
  } else if (!captchaValid) {
    console.log(`\n\tCaptcha Invalid`);
    req.flash("error_msg", "Captcha Invalid");
    return res.redirect("/auth/register");
  } else {
    passport.authenticate("local-register", {
      successRedirect: "/user",
      failureRedirect: "/auth/register",
      failureFlash: true,
    })(req, res, next);
  }
};
