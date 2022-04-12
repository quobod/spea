import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { customAlphabet } from "nanoid";
import csurf from "csurf";
import flash from "connect-flash";
import twilio from "twilio";
import { fs } from "mz";
import connectDB from "./config/db.js";
import passportConfig from "./config/passport.js";
import { create } from "./custom_modules/captcha.js";
import adapter from "webrtc-adapter";
import {
  log,
  cls,
  successMessage,
  infoMessage,
  stringify,
  keys,
  dlog,
  dbMessage,
} from "./custom_modules/index.js";
import landing from "./routers/home/index.js";
import auth from "./routers/auth/index.js";
import user from "./routers/user/index.js";
import contact from "./routers/contact/index.js";
import User from "./models/UserModel.js";
import userManager from "./custom_modules/UsersManager.js";

dotenv.config();
mongoose.Promise = global.Promise;

connectDB(mongoose);

const mongoStore = MongoDBStore(session);
const store = new mongoStore({
  uri: process.env.DB_URI,
  databaseName: process.env.DB_NAME,
  collection: process.env.DB_TABLE,
});

store.on("error", (err) => {
  log(err);
});

store.on("connected", () => {
  const msg = dbMessage("\tStore connected to DB");
  log(msg);
});

// constants
const csrfProtection = csurf({ httpOnly: true });
const sessionMiddleware = session({
  secret: process.env.SECRET,
  key: process.env.SESSION_NAME,
  resave: true,
  saveUninitialized: true,
  store: store,
});
const nanoid = customAlphabet("02468ouqtyminv", 13);
const __dirname = path.resolve(".");
const PORT = process.env.SPORT || 8443;
const ADDRESS = process.env.ADDRESS || "0.0.0.0";

// Express app
const app = express();

passportConfig(passport);

app.set("views", path.join(__dirname, "views"));

// view engine setup
app.engine(
  ".hbs",
  expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "layout",
    partials: "partials",
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache,no-store,max-age=0,must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "-1");
  res.setHeader("X-XSS-Protection", "1;mode=block");
  // res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("keep-alive", "-1");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Content-Security-Policy", "script-src 'self'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("x-powered-by", "Deez Nuts");
  res.setHeader("ETag", `${nanoid()}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, *"
  );
  next();
});

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.info_msg = req.flash("info_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Static assets
app.use(express.static("node_modules/twilio-video/dist/"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/get-turn-credentials", (req, res) => {
  // create the twilioClient
  try {
    const client = twilio(process.env.API_KEY, process.env.APP_SECRET, {
      accountSid: process.env.ACCT_SID,
    });

    client.tokens
      .create()
      .then((token) => {
        res.send(token);
      })
      .catch((err) => {
        log("\n\t" + err);
        res.send({ status: false, message: "failed to get token" });
      });
  } catch (err) {
    console.log(err);
    res.send({ status: false });
  }
});

const captchaUrl = "/captcha.jpg";
const captchaId = "captcha";
const captcha = create({ cookie: captchaId });

app.get(captchaUrl, captcha.image());

app.get(["/*"], csrfProtection, (req, res, next) => {
  next();
});

// Routes
app.use("/", landing);
app.use("/auth", auth);
app.use("/user", user);
app.use("/contacts", contact);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("registerme", (data) => {
    const { socketId, rmtId, hasCamera } = data;
    dlog(`Registering: ${socketId}\t${rmtId}\t${hasCamera}`);

    registerMe(data, (results) => {
      if (results.status) {
        io.emit("updateuserlist", results.userlist);
      } else {
        dlog(results.cause);
      }
    });
  });

  socket.on("changevisibility", (data) => {
    const { userId, show } = data;

    const peer = userManager.getUser(userId);

    if (peer) {
      dlog(`User ${peer.fname} ${peer.lname} wants to go invisible: ${show}`);
      peer.hide = show;
      io.emit("updateuserlist", userManager.getUsers());
    }
  });

  socket.on("disconnect", () => {
    const user = userManager.getUser(socket.id);

    if (user != null) {
      dlog(`User ${user.fname} ${user.lname} disconnected`);
      userManager.removeUserById(user.socketId);
    } else {
      dlog(`Socket user disconnected:\t${socket.id}`);
      userManager.removeUserById(socket.id);
    }

    io.emit("updateuserlist", userManager.getUsers());
    logPeers();
  });

  socket.on("participantdisconnected", (data) => {
    const { rmtUser } = data;
    const user = userManager.getUser(rmtUser);

    dlog(`Participant ${rmtUser} disconnected\n`);

    dlog(`User Count: ${userManager.getUserCount()}\n`);
  });

  socket.on("participant", (data) => {
    const { rmtId, participantIdentity, type } = data;
    const user = userManager.getUser(rmtId);

    dlog(`SocketIO participant emitter invoked`);

    if (user) {
      dlog(`Received participant identity`);
      user.participantIdentity = participantIdentity;
      dlog(user);
    }
  });

  socket.on("sendchatrequest", (data) => {
    const { sender, receiver, requestType } = data;

    const userSender = userManager.getUser(sender);
    const userReceiver = userManager.getUser(receiver);

    if (userSender && userReceiver) {
      dlog(
        `${userSender.fname} ${userSender.lname} is requesting a ${requestType} with ${userReceiver.fname} ${userReceiver.lname}`
      );

      dlog(`Receiver's socket ID: ${userReceiver.socketId}`);

      io.to(userReceiver.socketId).emit("chatrequest", {
        sender: userSender,
        requestType: requestType,
      });

      io.to(sender).emit("chatrequested", {
        receiver: userReceiver,
        requestType: requestType,
      });
    }
  });

  socket.on("chataccepted", (data) => {
    dlog(`Chat request accepted ${stringify(data)}`);
    const { senderSocketId, receiverSocketId, type } = data;

    io.to(senderSocketId).emit("chatrequestaccepted", {
      senderSocketId,
      receiverSocketId,
      type,
    });

    io.to(receiverSocketId).emit("chatrequestaccepted", {
      senderSocketId,
      receiverSocketId,
      type,
    });
  });

  socket.on("chatrejected", (data) => {
    dlog(`Chat request rejected ${stringify(data)}`);
    const { senderSocketId, receiverSocketId } = data;

    const userReceiver = userManager.getUser(receiverSocketId);

    if (userReceiver) {
      io.to(senderSocketId).emit("chatrejected", {
        response: "rejected",
        receiver: userReceiver,
      });
    }
  });

  socket.on("chatrequestnoresponse", (data) => {
    dlog(`Chat request no response ${stringify(data)}`);
    const { senderSocketId, receiverSocketId } = data;

    const userReceiver = userManager.getUser(receiverSocketId);

    if (userReceiver) {
      io.to(senderSocketId).emit("noresponse", {
        response: "noresponse",
        receiver: userReceiver,
      });
    }
  });

  socket.on("getonlineusers", (objContainer) => {
    objContainer = userManager.getUsers().filter((user) => user.hide == false);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  cls();
  log(
    successMessage(
      `\n\t\tServer listening on *:${PORT}\n\t\tServer Address: ${server._connectionKey}\n\n`
    )
  );
});

function logPeers() {
  const users = userManager.getUsers();
  if (users.length > 0) {
    dlog(infoMessage(`Connected Peers: ${users.length}`));
    users.forEach((p) => log(`\t\t${stringify(p)}`));
  } else {
    dlog(infoMessage(`${users.length} Connected Peers`));
  }
}

async function registerMe(userData, done) {
  const { socketId, rmtId, hasCamera } = userData;

  await User.findById(rmtId)
    .then((user) => {
      const res = user.withoutPassword();
      const registeredUser = userManager.getUser(rmtId);
      let results;

      if (registeredUser) {
        dlog(`${rmtId} is registered`);
        results = userManager.updateUser(rmtId, {
          socketId: `${socketId}`,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          hasCamera: hasCamera,
        });
      } else {
        results = userManager.addUser({
          socketId: `${socketId}`,
          rmtId: `${rmtId}`,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          hasCamera: hasCamera,
        });
      }
      if (results || results.status) {
        done({ status: true, userlist: userManager.getUsers() });
        logPeers();
      } else {
        done({
          status: false,
          cause: `UserManager unable to register user ID: ${user._id}`,
        });
      }
    })
    .catch((err) => {
      log(`\n\tError in the registerMe method`);
      log(err);
    });
}

function letsencryptOptions(domain) {
  const path = "/etc/letsencrypt/live/";
  return {
    key: fs.readFileSync(path + domain + "/privkey.pem"),
    cert: fs.readFileSync(path + domain + "/cert.pem"),
    ca: fs.readFileSync(path + domain + "/chain.pem"),
  };
}
