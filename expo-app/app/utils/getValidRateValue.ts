export const getValidRateValue = (value: number) => {
  let finalValue = value;

  if (finalValue > 5) finalValue = 5;
  if (finalValue < 0) finalValue = 0;

  return finalValue;
};
