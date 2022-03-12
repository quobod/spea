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
// import { engine } from "express-handlebars";
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { customAlphabet } from "nanoid";
import csurf from "csurf";
import flash from "connect-flash";
import axios from "axios";
import { fs } from "mz";
import connectDB from "./config/db.js";
import passportConfig from "./config/passport.js";
import {
  log,
  cls,
  successMessage,
  infoMessage,
  stringify,
  keys,
  userManager,
  dbMessage,
} from "./custom_modules/index.js";
import landing from "./routers/home/index.js";
import auth from "./routers/auth/index.js";
import user from "./routers/user/index.js";
import User from "./models/UserModel.js";

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
const PORT = process.env.PORT || 3000;
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
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/get-turn-credentials", (req, res) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = twilio(accountSid, authToken);
  client.tokens
    .create()
    .then((token) => {
      res.send(token);
    })
    .catch((err) => {
      log("\n\t" + err);
      res.send({ message: "failed to get token" });
    });
});

app.get(["/*"], csrfProtection, (req, res, next) => {
  next();
});

// Routes
app.use("/", landing);
app.use("/auth", auth);
app.use("/user", user);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("registerme", (data) => {
    const { socketId, rmtId } = data;
    log(
      `\nsocket server received user data: ${stringify(
        data
      )}\nNow calling registerMe method.\n`
    );
    registerMe(data, (results) => {
      if (results.status) {
        io.emit("updateuserlist", results.userlist);
      }
    });
  });

  socket.on("changevisibility", (data) => {
    const { userId, show } = data;

    const peer = userManager.getUser(userId);

    if (peer) {
      peer.hide = show;
      io.emit("updateuserlist", userManager.getUsers());
    }
  });

  socket.on("disconnect", () => {
    const user = userManager.getUser(socket.id);

    if (user) {
      console.log(`\n\tUser ${user.fname} ${user.lname} disconnected`);
      userManager.removeUserById(socket.id);
    }

    io.emit("updateuserlist", userManager.getUsers());
    logPeers();
  });
});

server.listen(PORT, () => {
  cls();
  log(
    successMessage(
      `\n\t\tServer listening on *:${PORT}\n\t\tServer Address: ${server._connectionKey}\n\n`
    )
  );
});

function logPeers() {
  const users = userManager.getUsers();
  console.log(infoMessage(`\n\tConnected Peers: ${users.length}`));
  if (users.length > 0) {
    users.forEach((p) => log(`\t\t${stringify(p)}`));
  }
}

async function registerMe(userData, done) {
  const { socketId, rmtId } = userData;

  await User.findById(rmtId)
    .then((user) => {
      const res = user.withoutPassword();
      const addedUser = {
        socketId,
        rmtId,
        ...res,
      };

      const results = userManager.addUser(addedUser);

      if (results) {
        done({ status: true, userlist: userManager.getUsers() });
        logPeers();
      } else {
        done({ status: false });
      }
    })
    .catch((err) => {
      log(`\n\tError in the registerMe method`);
      log(err);
    });
}
