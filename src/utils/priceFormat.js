/* eslint-disable no-void */
export default function currencyTextMask(
  value,
  precision,
  decimalSeparator,
  thousandSeparator,
  allowNegative,
  prefix,
  suffix
) {
  if (precision === void 0) precision = 2;
  if (decimalSeparator === void 0) decimalSeparator = ".";
  if (thousandSeparator === void 0) thousandSeparator = ",";
  if (allowNegative === void 0) allowNegative = false;
  if (prefix === void 0) prefix = "";
  if (suffix === void 0) suffix = "";

  if (precision < 0) {
    precision = 0;
  }
  if (precision > 20) {
    precision = 20;
  }

  if (value === null || value === undefined) {
    return {
      value: 0,
      maskedValue: "",
    };
  }

  value = String(value);

  if (value.length === 0) {
    return {
      value: 0,
      maskedValue: "",
    };
  }

  let digits = value.match(/\d/g) || ["0"];

  let numberIsNegative = false;
  if (allowNegative) {
    const negativeSignCount = (value.match(/-/g) || []).length;

    numberIsNegative = negativeSignCount % 2 === 1;

    let allDigitsAreZero = true;
    for (let idx = 0; idx < digits.length; idx += 1) {
      if (digits[idx] !== "0") {
        allDigitsAreZero = false;
        break;
      }
    }
    if (allDigitsAreZero) {
      numberIsNegative = false;
    }
  }

  while (digits.length <= precision) {
    digits.unshift("0");
  }

  if (precision > 0) {
    digits.splice(digits.length - precision, 0, ".");
  }

  digits = Number(digits.join(""))
    .toFixed(precision)
    .split("");
  let raw = Number(digits.join(""));

  let decimalpos = digits.length - precision - 1;
  if (precision > 0) {
    digits[decimalpos] = decimalSeparator;
  } else {
    decimalpos = digits.length;
  }

  for (let x = decimalpos - 3; x > 0; x -= 3) {
    digits.splice(x, 0, thousandSeparator);
  }

  if (prefix.length > 0) {
    digits.unshift(prefix);
  }
  if (suffix.length > 0) {
    digits.push(suffix);
  }
  if (allowNegative && numberIsNegative) {
    digits.unshift("-");
    raw = -raw;
  }
  return {
    value: raw,
    maskedValue: digits.join("").trim(),
  };
}
