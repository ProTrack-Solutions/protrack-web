import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";

export const formatPhoneNational = (
  phone: string | null | undefined,
  defaultCountry: CountryCode = "BR",
): string => {
  if (!phone) return "";

  const phoneNumberObj = parsePhoneNumberFromString(phone, defaultCountry);

  return phoneNumberObj ? phoneNumberObj.formatNational() : phone;
};
