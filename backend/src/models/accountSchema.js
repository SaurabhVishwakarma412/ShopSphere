const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const createAccountSchema = (role) => {
  const accountSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
      password: { type: String, required: true, minlength: 6, select: false },
      phone: { type: String, default: "" },
      address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
      },
    },
    { timestamps: true }
  );

  accountSchema.virtual("role").get(() => role);

  accountSchema.pre("save", async function hashPassword() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
  });

  accountSchema.methods.matchPassword = function matchPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  accountSchema.methods.toAuthJSON = function toAuthJSON() {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      phone: this.phone,
      address: this.address,
    };
  };

  return accountSchema;
};

module.exports = createAccountSchema;
