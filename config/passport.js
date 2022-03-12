import { Strategy } from "passport-local";
import User from "../models/UserModel.js";
import { createHash } from "../custom_modules/index.js";

const passportConfig = (passport) => {
  passport.use(
    new Strategy(
      {
        usernameField: "email",
        passwordField: "pwd",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        console.log(`\n\n\t\tMade it to passport\n\n`);
        // Match User
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "User is not registered" });
            }

            // Match Password
            if (user.matchPassword(password)) {
              req.flash("success_msg", "You're signed in");
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid credentials" });
            }
          })
          .catch((err) => {
            return done(null, false, { message: `${err}` });
          });
      }
    )
  );

  passport.use(
    "local-register",
    new Strategy(
      {
        usernameField: "email",
        passwordField: "pwd",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        console.log(`\n\n\t\tMade it to passport local-register\n\n`);

        User.findOne(
          {
            $or: [{ email: `${email}` }, { uname: `${email}` }],
          },
          (err, user) => {
            if (err) {
              console.log(`\n\tPassport local-register error`);
              console.log(err);
              console.log(`\n\n`);
              return done(null, false, { message: `${err}` });
            }

            if (user) {
              console.log(`\n\tEmail is already registered`);
              return done(null, false, {
                message: `Email is already registered`,
              });
            } else {
              const { email, pwd, pwd2, fname, lname } = req.body;
              const newUser = new User({
                email,
                fname,
                lname,
              });

              createHash(password, (results) => {
                if (results.status) {
                  const { original, payload } = results;

                  console.log(
                    `\n\tHash Successful\n\t\tOriginal: ${original}\n\t\tPayload: ${payload}`
                  );

                  newUser.password = payload;

                  newUser
                    .save()
                    .then((doc) => {
                      return done(null, doc);
                    })
                    .catch((err) => {
                      console.log(
                        `\n\tPassport local-register save newUser error`
                      );
                      console.log(err);
                      console.log(`\n\n`);
                      return done(null, false, { message: `${err}` });
                    });
                } else {
                  const { error } = results;
                  console.log(`\n\tHash Error\n\t\t${error}\n`);
                  return done(null, false, { message: `${error}` });
                }
              });
            }
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

export default passportConfig;
