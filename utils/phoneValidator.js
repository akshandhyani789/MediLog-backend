export const isValidIndianPhone = (phone) => {
  if (!phone) return false;

  const cleaned = String(phone).trim();

  // Must be 10 digits and start with 6–9
  return /^[6-9]\d{9}$/.test(cleaned);
};