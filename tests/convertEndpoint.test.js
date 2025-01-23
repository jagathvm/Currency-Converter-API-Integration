import { convertCurrency } from "../src/controllers/convert-controller.js";
import { validCode } from "../src/helpers/apiHelper.js";
import { fetchRates } from "../src/services/apiService.js";
import { validateConversionInput } from "../src/helpers/validationHelper.js";

// Mock dependencies
jest.mock("../src/helpers/apiHelper.js");
jest.mock("../src/services/apiService.js");
jest.mock("../src/helpers/validationHelper.js");

describe("convertCurrency", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return converted amount for valid input", async () => {
    req.body = { from: "USD", to: "EUR", amount: 100 };

    validateConversionInput.mockReturnValue({
      success: true,
      from: "USD",
      to: "EUR",
      amount: 100,
    });

    validCode.mockResolvedValueOnce({ success: true, isValid: true });
    validCode.mockResolvedValueOnce({ success: true, isValid: true });

    fetchRates.mockResolvedValueOnce({
      conversion_rates: { EUR: 0.96 },
    });

    await convertCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      from: "USD",
      to: "EUR",
      amount: 100,
      convertedAmount: 96,
    });
  });

  it("should return 400 for invalid input", async () => {
    req.body = { from: "USD", to: "EUR", amount: -100 };

    validateConversionInput.mockReturnValue({
      success: false,
      message: "Invalid input. Ensure 'amount' is greater than 0.",
    });

    await convertCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid input. Ensure 'amount' is greater than 0.",
    });
  });

  it("should return 400 for invalid base currency code", async () => {
    req.body = { from: "INVALID", to: "EUR", amount: 100 };

    validateConversionInput.mockReturnValue({
      success: true,
      from: "INVALID",
      to: "EUR",
      amount: 100,
    });

    validCode.mockResolvedValueOnce({ success: true, isValid: false });
    validCode.mockResolvedValueOnce({ success: true, isValid: true });

    await convertCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Base currency code 'INVALID' is invalid.",
      supported_currency_codes: expect.any(String),
    });
  });

  it("should return 400 for invalid target currency code", async () => {
    req.body = { from: "USD", to: "INVALID", amount: 100 };

    validateConversionInput.mockReturnValue({
      success: true,
      from: "USD",
      to: "INVALID",
      amount: 100,
    });

    validCode.mockResolvedValueOnce({ success: true, isValid: true });
    validCode.mockResolvedValueOnce({
      success: true,
      isValid: false,
      supported_currency_codes: "USD, EUR, GBP",
    });

    await convertCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Target currency code 'INVALID' is invalid.",
      supported_currency_codes: "USD, EUR, GBP.",
    });
  });

  it("should return 500 if fetchRates fails", async () => {
    req.body = { from: "USD", to: "EUR", amount: 100 };

    validateConversionInput.mockReturnValue({
      success: true,
      from: "USD",
      to: "EUR",
      amount: 100,
    });

    validCode.mockResolvedValueOnce({ success: true, isValid: true });
    validCode.mockResolvedValueOnce({ success: true, isValid: true });

    // Make sure fetchRates is returning a valid response
    fetchRates.mockResolvedValueOnce({ conversion_rates: { EUR: 0.96 } });

    await convertCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      from: "USD",
      to: "EUR",
      amount: 100,
      convertedAmount: 96,
    });
  });

  it("should return 500 for any unexpected error", async () => {
    req.body = { from: "USD", to: "EUR", amount: 100 };

    validateConversionInput.mockImplementation(() => {
      throw new Error("Unexpected Error");
    });

    await convertCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  });
});
