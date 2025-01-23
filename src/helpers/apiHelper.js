// Imports
import { getSupportedCurrencyCodes } from "../services/apiService.js";

// Helper
export const validCode = async (value) => {
  try {
    // Fetch supported currency codes
    const { success, supported_codes } = await getSupportedCurrencyCodes();

    // If no codes are found in the response, return an error
    if (!success)
      return {
        success: false,
        isValid: false,
      };

    // Check if the base currency exists in the supported list
    const isValid = supported_codes.some(([code]) => code === value);

    // If the base currency is invalid, return an error
    if (!isValid)
      return {
        success: true,
        isValid: false,
        supported_currency_codes: supported_codes
          .map(([code]) => code)
          .join(", "),
      };

    // If the base currency is valid, return success and isValid
    return {
      success: true,
      isValid: true,
    };
  } catch (error) {
    // Handle errors
    console.error(`Error fetching supported currencies: ${error.message}`);

    return {
      success: false,
      isValid: false,
      message: "Failed to fetch supported currencies.",
    };
  }
};
