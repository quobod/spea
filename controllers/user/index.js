import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import { body, check, validationResult } from "express-validator";
import { cap, stringify, log } from "../../custom_modules/index.js";
import Contact from "../../models/Contacts.js";
import User from "../../models/UserModel.js";

const logger = bunyan.createLogger({ name: "User Controller" });

//  @desc           User Dashboard
//  @route          GET /user/dashboard
//  @access         Private
export const userDashboard = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/dashboard`);

  try {
    const user = req.user.withoutPassword();
    user.fname = cap(user.fname);
    user.lname = cap(user.lname);

    // console.log(user);
    console.log(`\n\n`);

    Contact.find()
      .sort({ fname: "asc" })
      .where("owner")
      .equals(`${user._id}`)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        }

        res.render("user/dashboard", {
          title: `Dashboard`,
          user: user,
          csrfToken: req.csrfToken,
          hasContacts: docs.length > 0,
          contacts: docs,
          dashboard: true,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: JSON.stringify(err) });
  }
});

//  @desc           Add new contact
//  @route          POST /user/contacts
//  @access         Private
export const addNewContact = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/contacts`);

  const { fname, lname, email, phone } = req.body;

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };

  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    // logger.error(`Registration Failure: ${JSON.stringify(result.array())}`);

    const err = result.array();
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

    return res.render("user/dashboard", {
      title: "Error",
      error: true,
      errors: arrResult,
      csrfToken: req.csrfToken,
      dashboard: true,
    });
  } else {
    const { email, phone, fname, lname } = req.body;
    const user = req.user.withoutPassword();

    const newContact = new Contact({
      emails: [email],
      phones: [phone],
      fname,
      lname,
      owner: user._id,
    });

    newContact
      .save()
      .then((doc) => {
        console.log("\n\tNew contact " + doc);

        res.redirect("/user/dashboard");
      })
      .catch((err) => {
        console.log(err);

        res.redirect("/user/dashboard");
      });

    /*  User.findOne({ email: `${email}` })
       .then((user) => {
         if (user == null) {
           const newUser = new User({
             email,
             password: pwd,
             fname,
             lname,
           });

           newUser
             .save()
             .then((doc) => {
               res.redirect("/auth/signin");
             })
             .catch((err) => {
               console.log(err);
               res.redirect("/auth/register");
             });
         }
       })
       .catch((err) => {
         console.log(err);
         res.status(200).json({ error: err });
       }); */
  }
});

//  @desc           Search contacts by keyword
//  @route          POST /user/contacts/search
//  @access         Private
export const searchContacts = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/contacts/search`);
  const { searchKey } = req.body;
  const user = req.user;

  console.log(`\n\tSearcing by keyword: ${searchKey}`);

  Contact.find(
    {
      $or: [
        { emails: { $in: `${searchKey}` } },
        { fname: `${searchKey}` },
        { lname: `${searchKey}` },
        { phones: { $in: `${searchKey}` } },
      ],
    },
    (err, docs) => {
      if (err) {
        log(`\n\tError`);
        log(err);
        log(`\n\n`);

        res.render("user/dashboard", {
          title: `Dashboard`,
          user: user,
          csrfToken: req.csrfToken,
          error: true,
          errors: err,
        });
      }
      log(`\n`);
      console.log(docs);
      log(`\n`);

      res.render("user/dashboard", {
        title: `Dashboard`,
        user: user,
        csrfToken: req.csrfToken,
        hasContacts: docs.length > 0,
        contacts: docs,
        dashboard: true,
      });
    }
  );
});

//  @desc           View single contact
//  @route          GET /user/contacts/:contactId
//  @access         Private
export const viewContact = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/contacts/:contactId`);

  const { contactId } = req.params;

  log(`\n\tViewing contact ID: ${contactId}\n`);

  Contact.findOne({ _id: contactId }, (err, doc) => {
    if (err) {
      log(err);
      res.redirect(`/user/dashboard`);
    } else {
      log(doc);

      res.render("user/contact", {
        doc: doc,
        csrfToken: req.csrfToken,
        title: doc.fname,
        user: req.user,
        singlecontact: true,
      });
    }
  });
});

//  @desc           Edit single contact
//  @route          POST /user/contacts/contact/:contactId
//  @access         Private
export const editContact = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/contacts/contact/:contactId`);
  log(`\n\tEditing contact\n`);

  const data = req.body;
  const rmtid = data.rmtid;
  const fname = data.fname;
  const lname = data.lname;

  let emails = [],
    phones = [];

  log(`\n\n`);

  for (const d in data) {
    const objD = data[d];
    if (d.toLowerCase().trim().startsWith("email")) {
      emails.push(objD);
    } else if (d.toLowerCase().trim().startsWith("phone")) {
      phones.push(objD);
    }
  }

  const updatedData = {
    fname: fname,
    lname: lname,
    emails: emails,
    phones: phones,
  };

  log(`\n\t\tSubmitted Data`);
  log(updatedData);
  log(`\n\n`);

  const updateOptions = {
    upsert: true,
    new: true,
    overwrite: false,
  };

  Contact.findOneAndUpdate(
    { _id: `${rmtid}` },
    updatedData,
    updateOptions,
    (err, doc) => {
      if (err) {
        log(`\n\n\t\tError`);
        log(err);
      }

      log(`\n\tUpdated Document`);
      log(doc);
      res.redirect("/user/dashboard");
    }
  );
});

//  @desc           Delete single contact
//  @route          GET /user/contacts/contact/delete/:contactId
//  @access         Private
export const deleteContact = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/contacts/contact/delete/:contactId`);

  const { contactId } = req.params;

  log(`\n\tDeleting contact ID: ${contactId}\n`);

  Contact.deleteOne({ _id: `${contactId}` }, (err, results) => {
    if (err) {
      log(`\n\tError deleting document: ${contactId}`);
      log(err);
      log(`\n`);
    }

    log(`\n\tDelete Results`);
    log(results);
    res.redirect("/user/dashboard");
  });
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

  const oUser = req.user;
  const { email, pwd } = req.body;
  console.log(
    `\n\tRe-authentication Data\n\t\tEmail: ${email}, Password: ${pwd}\n`
  );

  const matched = await oUser.matchPassword(pwd);

  if (matched) {
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
