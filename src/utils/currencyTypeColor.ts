export const colorByCurrencyAmount = (amount: number, currency: string) => {
  if (currency === "GCS") {
    return amount >= 0 ? "blue.6" : "red.6";
  }

  return amount >= 0 ? "blue.3" : "red.3";
};
