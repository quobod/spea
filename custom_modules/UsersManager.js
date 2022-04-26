import {
  successStatus,
  warningStatus,
  isArray,
  isObject,
  isNull,
  log,
  dlog,
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
          if (this.getUserById(rmtId) == null) {
            this.users.push({ ...data, hide: false });

            dlog(
              successStatus(`Added new user ${stringify(this.getUser(rmtId))}`)
            );
            return { status: true };
          } else {
            dlog(warningStatus(`User already registered`));
            return { status: false, cause: "User is already registered" };
          }
        } else {
          dlog(warningStatus(`Object is missing rmtId property`));
          return { status: false, cause: "Object is missing rmtId property" };
        }
      } else {
        dlog(warningStatus(`Expecting an Object not an Array`));
        return { status: false, cause: "Expecting an Object not an Array" };
      }
    } else {
      dlog(warningStatus(`Parameter null or undefined`));
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
        (u) => u.socketId === uid || u.rmtId === uid
      );

      if (userIndex != -1) {
        let user = this.users[userIndex];

        user = Object.assign(user, objArg);
        dlog(successStatus(`User successfully updated`));
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
