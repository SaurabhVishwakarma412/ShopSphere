const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const createAccountSchema = (role) => {
  const schemaDefinition = {
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
  };

  if (role === "customer") {
    schemaDefinition.wishlist = [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ];
  }

  const accountSchema = new mongoose.Schema(schemaDefinition, { timestamps: true });

  accountSchema.virtual("role").get(() => role);

  accountSchema.pre("save", async function hashPassword() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
  });

  accountSchema.methods.matchPassword = function matchPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  accountSchema.methods.toAuthJSON = function toAuthJSON() {
    const json = {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      phone: this.phone,
      address: this.address,
    };
    if (this.wishlist !== undefined) {
      json.wishlist = this.wishlist;
    }
    return json;
  };

  return accountSchema;
};

module.exports = createAccountSchema;
