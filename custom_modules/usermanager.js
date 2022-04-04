import { successStatus } from "./index.js";

let users = [];

const log = (arg = "") => console.log(arg);

const getUserById = (uid) =>
  users.find((u) => u.uid == uid || u.rmtId == uid) || null;

export const addUser = (data) => {
  const { socketId, fname, lname, email, rmtId, hasCamera } = data;

  if (getUserById(socketId) == null) {
    users.push({
      uid: socketId,
      fname,
      lname,
      email,
      rmtId: rmtId,
      hide: false,
      hasCamera,
    });
    log(successStatus(`\n\tAdded new user ${socketId}`));
    return true;
  } else {
    log(`\n\tUser already registered`);
    return false;
  }
};

export const removeUserBySocketId = (uid) => {
  users = users.filter((u) => u.uid !== uid);
};

export const removeUserRmtId = (uid) => {
  users = users.filter((u) => u.rmtId !== uid);
};

export const updateUser = (uid, objArg) => {
  if (null != objArg && typeof objArg === "object") {
    const userIndex = users.findIndex((u) => u.uid === uid || u.rmtId === uid);

    if (userIndex != -1) {
      let user = users[userIndex];

      user = Object.assign(user, objArg);
    }
  }
};

export const updateUserProperty = (uid, property, value) => {
  const user = getUserById(uid);

  if (null != user) {
    user[`${property}`] = value;
    return `${property}` in user;
  }
};

export const deleteUserProperty = (uid, property) => {
  const user = getUserById(uid);

  if (null != user) {
    if (property in user) {
      delete user[`${property}`];
      return !`${property}` in user;
    }
  }
};

export const registerMe = (uid, data) => {};

export const getUser = (uid) => getUserById(uid);

export const getUsers = () => users;

export const getUserCount = () => users.length;
