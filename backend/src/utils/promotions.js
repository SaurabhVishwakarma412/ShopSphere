const PROMOTIONS = {
  WELCOME10: {
    code: "WELCOME10",
    label: "Welcome offer",
    description: "10% off on orders above Rs. 499",
    type: "percent",
    value: 10,
    minSubtotal: 499,
    maxDiscount: 300,
  },
  FESTIVE15: {
    code: "FESTIVE15",
    label: "Festive deal",
    description: "15% off on orders above Rs. 1,499",
    type: "percent",
    value: 15,
    minSubtotal: 1499,
    maxDiscount: 750,
  },
  FREESHIP: {
    code: "FREESHIP",
    label: "Free delivery",
    description: "Free shipping on orders above Rs. 399",
    type: "shipping",
    value: 0,
    minSubtotal: 399,
  },
};

const normalizeCouponCode = (code = "") => String(code).trim().toUpperCase();

const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

const getPromotion = (code) => PROMOTIONS[normalizeCouponCode(code)] || null;

const calculatePromotion = ({ code, subtotal, shippingPrice }) => {
  const promotion = getPromotion(code);
  if (!promotion) {
    return { error: "Coupon code is not valid" };
  }

  if (subtotal < promotion.minSubtotal) {
    return {
      error: `${promotion.code} applies on orders above Rs. ${promotion.minSubtotal}`,
    };
  }

  const discountAmount =
    promotion.type === "shipping"
      ? roundMoney(shippingPrice)
      : roundMoney(Math.min((subtotal * promotion.value) / 100, promotion.maxDiscount || Infinity));

  return {
    code: promotion.code,
    label: promotion.label,
    description: promotion.description,
    discountAmount,
  };
};

module.exports = {
  PROMOTIONS,
  calculatePromotion,
  normalizeCouponCode,
};
