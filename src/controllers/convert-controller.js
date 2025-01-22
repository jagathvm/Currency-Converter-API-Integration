// Imports
import { fetchRates } from "../services/apiService.js";
import { validCode } from "../helpers/apiHelper.js";
import { validateConversionInput } from "../helpers/validationHelper.js";

// Controller
export const convertCurrency = async (req, res) => {
  // Validate the input
  const { success, message, from, to, amount } = validateConversionInput(
    req.body
  );
  if (!success) return res.status(400).json({ success, message });

  try {
    // Check if the base currency exists in the supported list
    const {
      success,
      isValid: validBase,
      supported_currency_codes: validBaseCurrencyCodes,
    } = await validCode(from);

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
        message: `Base currency code '${from}' is invalid.`,
        supported_currency_codes: `${validBaseCurrencyCodes}. `,
      });

    // Check if the target currency exists in the supported list
    // console.log(await validCode(to));
    const {
      isValid: validTarget,
      supported_currency_codes: validTargetCurrencyCodes,
    } = await validCode(to);

    // If the target currency is invalid, return an error
    if (!validTarget)
      return res.status(400).json({
        success: false,
        message: `Target currency code '${to}' is invalid. `,
        supported_currency_codes: `${validTargetCurrencyCodes}. `,
      });

    // Fetch all conversion rates
    const { conversion_rates } = await fetchRates(from);

    // Check if the target currency exists in the conversion rates
    const conversionRateOfTarget = conversion_rates[to];

    // If the target currency is not found in the conversion rates, return an error
    if (!conversionRateOfTarget)
      return res.status(400).json({
        success: false,
        message: `Conversion rate for target currency '${to}' is not available. `,
      });

    // Calculate the converted amount
    const convertedAmount = amount * conversionRateOfTarget;

    // Return the converted amount
    return res.status(200).json({
      from,
      to,
      amount,
      convertedAmount,
    });
  } catch (error) {
    // Log the error
    console.error(`Conversion error: ${error.message}`);
    console.error(error.stack);

    // Return an error
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
