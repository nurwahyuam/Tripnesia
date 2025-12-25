/**
 * Fungsi untuk memformat harga menjadi format mata uang Rupiah (IDR)
 * Contoh:
 *  formatPrice(15000) -> "Rp15.000"
 *  formatPrice(null) -> "Price not available"
 */

export const formatPrice = (price) => {
  if (price === null || price === undefined || price === 0) {
    return "Price not available";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};
