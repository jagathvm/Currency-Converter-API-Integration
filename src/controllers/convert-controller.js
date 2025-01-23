// Imports
import { fetchRates } from "../services/apiService.js";
import { validCode } from "../helpers/apiHelper.js";
import { validateConversionInput } from "../helpers/validationHelper.js";

// Controller
export const convertCurrency = async (req, res) => {
  try {
    // Validate the input
    const { success, message, from, to, amount } = validateConversionInput(
      req.body
    );
    if (!success) return res.status(400).json({ success, message });

    // Validate base and target currencies concurrently
    const [baseValidation, targetValidation] = await Promise.all([
      validCode(from),
      validCode(to),
    ]);

    if (!baseValidation.success || !targetValidation.success)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error. Please try again later.",
      });

    if (!baseValidation.isValid)
      return res.status(400).json({
        success: false,
        message: `Base currency code '${from}' is invalid.`,
        supported_currency_codes: `${baseValidation.supported_currency_codes}. `,
      });

    if (!targetValidation.isValid)
      return res.status(400).json({
        success: false,
        message: `Target currency code '${to}' is invalid.`,
        supported_currency_codes: `${targetValidation.supported_currency_codes}.`,
      });

    // Fetch all conversion rates
    const { conversion_rates } = await fetchRates(from);

    // Check if the target currency exists in the conversion rates
    const conversionRateOfTarget = conversion_rates[to];

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
    console.error(`Conversion API error: ${error}`);
    console.error(error.stack);

    // Return an error
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
