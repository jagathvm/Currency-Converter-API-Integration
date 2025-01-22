// Imports
import { fetchRates } from "../services/apiService.js";
import { validCode } from "../helpers/apiHelper.js";

// Controller
export const getRates = async (req, res) => {
  // Get the base currency from the query parameters or default to "USD"
  const base = req?.query?.base || "USD";

  try {
    // Check if the base currency exists in the supported list
    const {
      success,
      isValid: validBase,
      supported_currency_codes,
    } = await validCode(base, res);

    // If not a successful response, return an error
    if (!success)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error. Please try again later.",
      });

    // If the base currency is invalid, return an error
    if (!validBase)
      return res.status(400).json({
        success: false,
        message: `Base currency code ${base} is invalid.`,
        supported_currency_codes: `${supported_currency_codes}. `,
      });

    // Fetch the result, base currency code, and conversion rates using the valid base
    const { base_code, conversion_rates, result } = await fetchRates(base);

    // Return the result, base currency code, and conversion rates
    return res
      .status(200)
      .json({ result, base: base_code, rates: conversion_rates });
  } catch (error) {
    // Handle errors
    console.error(
      `An unexpected error occured while fetching rates: ${error.message}`
    );

    // Return an error
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rates from API. Please try again later.",
    });
  }
};
