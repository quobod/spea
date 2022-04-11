import {
  successStatus,
  warningStatus,
  isArray,
  isObject,
  isNull,
  log,
  stringify,
} from "./index.js";

class UserManager {
  constructor() {
    this.users = [];
  }

  addUser = (data) => {
    if (!isNull(data)) {
      if (isObject(data)) {
        if ("rmtId" in data) {
          const { rmtId } = data;
          if (!this.getUserById(rmtId)) {
            this.users.push({ ...data, hide: false });

            log(
              successStatus(
                `\n\tAdded new user ${stringify(this.getUser(rmtId))}`
              )
            );
            return { status: true };
          } else {
            log(warningStatus(`\n\tUser already registered`));
            return { status: false, cause: "User is already registered" };
          }
        } else {
          log(warningStatus(`\n\tObject is missing rmtId property`));
          return { status: false, cause: "Object is missing rmtId property" };
        }
      } else {
        log(warningStatus(`\n\tExpecting an Object not an Array`));
        return { status: false, cause: "Expecting an Object not an Array" };
      }
    } else {
      log(warningStatus(`\n\tParameter null or undefined`));
      return { status: false, cause: "Parameter null or undefined" };
    }
  };

  removeUserById = (uid) => {
    this.users = this.users.filter(
      (user) => user.socketId != uid && user.rmtId != uid
    );
  };

  getUserById = (uid) =>
    this.users.find((user) => user.socketId == uid || user.rmtId == uid) ||
    null;

  updateUser = (uid, objArg) => {
    if (null != objArg && typeof objArg === "object") {
      const userIndex = this.users.findIndex(
        (u) => u.uid === uid || u.rmtId === uid
      );

      if (userIndex != -1) {
        let user = this.users[userIndex];

        user = Object.assign(user, objArg);
        log(successStatus(`\n\tUser successfully updated`));
        return true;
      }
    }

    return false;
  };

  updateUserProperty = (uid, property, value) => {
    const user = this.getUserById(uid);

    if (null != user) {
      user[`${property}`] = value;
      return `${property}` in user;
    }
  };

  getUser = (uid) => this.getUserById(uid);

  getUsers = () => this.users;

  getUserCount = () => this.users.length;

  toString = () => "User Manager";
}

const userManager = new UserManager();

export default userManager;
