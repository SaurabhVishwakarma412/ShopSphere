export const PROMOTIONS = {
  WELCOME10: {
    code: 'WELCOME10',
    label: 'Welcome offer',
    description: '10% off on orders above Rs. 499',
    type: 'percent',
    value: 10,
    minSubtotal: 499,
    maxDiscount: 300,
  },
  FESTIVE15: {
    code: 'FESTIVE15',
    label: 'Festive deal',
    description: '15% off on orders above Rs. 1,499',
    type: 'percent',
    value: 15,
    minSubtotal: 1499,
    maxDiscount: 750,
  },
  FREESHIP: {
    code: 'FREESHIP',
    label: 'Free delivery',
    description: 'Free shipping on orders above Rs. 399',
    type: 'shipping',
    value: 0,
    minSubtotal: 399,
  },
}

export const normalizeCouponCode = (code = '') => String(code).trim().toUpperCase()

const roundMoney = (value) => Number(Number(value || 0).toFixed(2))

export const calculatePromotion = ({ code, subtotal, shipping }) => {
  const couponCode = normalizeCouponCode(code)
  const promotion = PROMOTIONS[couponCode]

  if (!couponCode) return { discount: 0, code: '', promotion: null, error: '' }
  if (!promotion) return { discount: 0, code: couponCode, promotion: null, error: 'Coupon code is not valid' }
  if (subtotal < promotion.minSubtotal) {
    return {
      discount: 0,
      code: couponCode,
      promotion,
      error: `${promotion.code} applies on orders above Rs. ${promotion.minSubtotal}`,
    }
  }

  const discount =
    promotion.type === 'shipping'
      ? roundMoney(shipping)
      : roundMoney(Math.min((subtotal * promotion.value) / 100, promotion.maxDiscount || Infinity))

  return { discount, code: couponCode, promotion, error: '' }
}

export const featuredPromotions = Object.values(PROMOTIONS)
