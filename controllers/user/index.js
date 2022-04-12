import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import { body, check, validationResult } from "express-validator";
import twilio from "twilio";
import { customAlphabet } from "nanoid";
import { cap, stringify, dlog } from "../../custom_modules/index.js";
import Contact from "../../models/Contacts.js";
import User from "../../models/UserModel.js";
import { create } from "../../custom_modules/captcha.js";

const logger = bunyan.createLogger({ name: "User Controller" });
const nanoid = customAlphabet("02468ouqtyminv", 13);
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const findOrCreateRoom = async (roomName) => {
  let twilioClient;

  try {
    twilioClient = twilio(process.env.API_KEY, process.env.APP_SECRET, {
      accountSid: process.env.ACCT_SID,
    });
    // see if the room exists already. If it doesn't, this will throw
    // error 20404.
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    // the room was not found, so create it
    if (error.code == 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: "go",
      });
    } else {
      // let other errors bubble up
      throw error;
    }
  }
};

const getAccessToken = (roomName) => {
  // create an access token
  const token = new AccessToken(
    process.env.ACCT_SID,
    process.env.API_KEY,
    process.env.APP_SECRET,
    // generate a random unique identity for this participant
    { identity: nanoid() }
  );
  // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // add the video grant
  token.addGrant(videoGrant);
  // serialize the token and return it
  return token.toJwt();
};

//  @desc           User Dashboard
//  @route          GET /user
//  @access         Private
export const userDashboard = asyncHandler(async (req, res) => {
  logger.info(`GET: /user`);

  try {
    const user = req.user.withoutPassword();
    user.fname = cap(user.fname);
    user.lname = cap(user.lname);

    res.render("user/dashboard", {
      title: "Dashboard",
      rmtId: user._id,
      dashboard: true,
      user: true,
      fname: user.fname,
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: JSON.stringify(err) });
  }
});

//  @desc           User Room
//  @route          GET /user/room
//  @access         Private
export const userRoom = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/room`);

  try {
    const rmtUser = req.user.withoutPassword();
    rmtUser.fname = cap(rmtUser.fname);
    rmtUser.lname = cap(rmtUser.lname);

    // dlog(stringify(rmtUser));

    res.render("user/room", {
      title: "Room",
      rmtId: rmtUser._id,
      room: true,
      user: true,
      rmtUser,
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: JSON.stringify(err) });
  }
});

//  @desc           View user's profile
//  @route          GET /user/profile
//  @access         Private
export const viewUserProfile = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/profile`);
  const user = req.user.withoutPassword() || null;

  if (user) {
    res.render("user/profile", {
      title: `Profile`,
      user,
      csrfToken: req.csrfToken,
      profile: true,
    });
  } else {
    res.redirect("/auth/signin");
  }
});

//  @desc           Reauthenticate User
//  @route          POST /user/reauth
//  @access         Private
export const userReauth = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/reauth`);

  const captchaId = "captcha";
  const captchaFieldName = "captcha";
  const captcha = create({ cookie: captchaId });
  const captchaValid = captcha.check(req, req.body[captchaFieldName]);

  const oUser = req.user;
  const { email, pwd } = req.body;
  console.log(
    `\n\tRe-authentication Data\n\t\tEmail: ${email}, Password: ${pwd}\n`
  );

  const matched = await oUser.matchPassword(pwd);
  if (!captchaValid) {
    console.log(`\n\tCaptcha Invalid`);
    req.flash("error_msg", "Captcha Invalid");
    return res.redirect("/user/dashboard");
  } else if (matched) {
    res.render("user/profile", {
      title: `Profile`,
      user: req.user,
      csrfToken: req.csrfToken,
      profile: true,
    });
  } else {
    res.redirect("/user/dashboard");
  }
});

//  @desc           Update User Profile
//  @route          POST /user/profile/update
//  @access         Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/profile/update`);
  const user = req.user.withoutPassword();
  const data = req.body;
  const updatedData = {
    fname: data.fname,
    lname: data.lname,
    email: data.email,
  };

  if (data.uname) {
    updatedData.uname = data.uname;
  }

  console.log(`\n\tUpdated Profile Data`);
  console.log(updatedData);
  console.log(`\n`);

  User.findByIdAndUpdate(user._id, updatedData, (err, user) => {
    if (err) {
      console.log(`\n\t\tUser update error`);
      console.log(err);
    }

    res.redirect("/user/dashboard");
  });
});

//  @desc           Video Chat
//  @route          POST /user/room
//  @access         Private
export const joinRoom = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/room`);
  const user = req.user.withoutPassword();

  // return 400 if the request has an empty body or no roomName
  if (!req.body || !req.body.roomName) {
    req.flash("warning_msg", "Must enter a room name");
    return res.redirect("/user/dashboard");
  }

  const roomName = req.body.roomName;
  try {
    // find or create a room with the given roomName
    findOrCreateRoom(roomName);

    // generate an Access Token for a participant in this room
    const token = getAccessToken(roomName);

    if (token) {
      res.render("user/room", {
        title: "Chat",
        user: user,
        rmtId: user._id,
        room: true,
        hasToken: true,
        token,
        roomName,
      });
    } else {
      console.log(`\n\tToken Failure`);
      return res.redirect("/user/dashboard");
    }
  } catch (err) {
    console.log(`\n\tjoinRoom error\n\t\t${err}\n`);
    return res.redirect("/user/dashboard");
  }
});
