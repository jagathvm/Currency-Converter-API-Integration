// Imports
import { API_CONFIG } from "../config/apiConfig.js";

// Services
export const fetchRates = async (base, res) => {
  // Build the API URL
  const url = `${API_CONFIG.BASE_URI}/${base}`;

  try {
    // Fetch the rates
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok)
      return res.status(400).json({
        success: false,
        message: `Failed to fetch rates from API.`,
      });

    // Extract the result, base currency code, and conversion rates from the response
    const { result, base_code, conversion_rates } = await response.json();

    // Return the result, base currency code, and conversion rates
    return { result, base_code, conversion_rates };
  } catch (error) {
    // Handle errors
    console.error(`Error fetching rates: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

export const getSupportedCurrencyCodes = async () => {
  try {
    // Fetch supported currency codes
    const response = await fetch(API_CONFIG.STDCODE_URI);

    // Check if the request was successful
    if (!response.ok) return { success: false };

    // Extract supported currency codes
    const { supported_codes } = await response.json();

    // If no codes are found in the response, return an error
    if (!supported_codes || !Array.isArray(supported_codes)) {
      console.error(`Invalid response format from API.`);
      return {
        success: false,
        message: `Unexpected response format from API. Please try again later.`,
      };
    }

    // Return the supported currency codes
    return { success: true, supported_codes };
  } catch (error) {
    // Handle errors
    console.error(`Error fetching supported currencies: ${error.message}`);
    return {
      success: false,
      message: "Internal Server Error. Please try again later.",
    };
  }
};
