const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      required: "An email address is required",
    },
    refreshToken: {
      token: { type: String },
    },

    googleId: {
      type: String,
      required: false,
    },
    favCities: [{type: String}]
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject._v;

  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email });
  console.log("findByCredentials user", user);

  if (user) {
    const match = await bcrypt.compare(plainPW, user.password);
    if (match) return user;
  } else {
    return null;
  }
};

UserSchema.pre("save", async function (next) {
  const user = this;
  const plainPW = user.password;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

const UserModel = model("User", UserSchema);
module.exports = UserModel;
