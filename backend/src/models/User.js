const Customer = require("./Customer");
const Seller = require("./Seller");

const getAccountModel = (role = "customer") => (role === "seller" ? Seller : Customer);

module.exports = {
  Customer,
  Seller,
  getAccountModel,
};
