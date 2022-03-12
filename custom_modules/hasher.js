import bcrypt from "bcryptjs";

export const createHash = (arg1, cb) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(arg1, salt, (err, hash) => {
      if (err) {
        return cb({ status: false, error: err.message });
      } else {
        cb({
          status: true,
          original: arg1,
          payload: hash,
        });
      }
    });
  });
};
