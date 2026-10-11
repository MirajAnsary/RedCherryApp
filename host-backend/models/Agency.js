// host-backend/models/Agency.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    isActive: { type: Boolean, default: true },
    createdByAdmin: { type: Boolean, default: true },
  },
  { timestamps: true },
);

agencySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

agencySchema.methods.comparePassword = async function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model("Agency", agencySchema, "Agencies");
