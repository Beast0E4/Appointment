const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: {
      type: String,
      required: [true, "Name cannot be empty"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email cannot be empty"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, 
      minLength: 8,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["USER", "PROVIDER"],
      default: ["USER"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function () {
    const hashedPassword = bcrypt.hashSync(this.password, 11);
    this.password = hashedPassword;
});

const User = mongoose.model('User', userSchema);
module.exports = User;