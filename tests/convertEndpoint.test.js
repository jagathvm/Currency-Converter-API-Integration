import { convertCurrency } from "../src/controllers/convert-controller";
import { fetchRates } from "../src/services/apiService";
import { validCode } from "../src/helpers/apiHelper";

jest.mock("../src/helpers/apiHelper"); // Mocking the helper functions
jest.mock("../src/services/apiService");

describe("POST /api/convert", () => {
  it("should return the correct converted amount", async () => {
    const mockRequest = {
      body: { from: "USD", to: "EUR", amount: 100 },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock responses for validCode and fetchRates
    validCode.mockResolvedValueOnce({
      success: true,
      isValid: true,
      supported_currency_codes: "USD, EUR",
    });
    fetchRates.mockResolvedValueOnce({
      conversion_rates: { EUR: 0.85 },
    });

    await convertCurrency(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      from: "USD",
      to: "EUR",
      amount: 100,
      convertedAmount: 85,
    });
  });

  it("should handle invalid base currency codes", async () => {
    const mockRequest = {
      body: { from: "ABC", to: "EUR", amount: 100 },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validCode.mockResolvedValueOnce({
      success: false,
      isValid: false,
      supported_currency_codes: "USD, EUR",
    });

    await convertCurrency(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Base currency code 'ABC' is invalid.",
      supported_currency_codes: "USD, EUR.",
    });
  });

  it("should handle invalid target currency code", async () => {
    const mockRequest = {
      body: { from: "USD", to: "XYZ", amount: 100 },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validCode.mockResolvedValueOnce({
      success: true,
      isValid: true,
      supported_currency_codes: "USD, EUR",
    });
    validCode.mockResolvedValueOnce({
      success: false,
      isValid: false,
      supported_currency_codes: "USD, EUR",
    });

    await convertCurrency(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Target currency code 'XYZ' is invalid. ",
      supported_currency_codes: "USD, EUR.",
    });
  });

  it("should handle missing conversion rate", async () => {
    const mockRequest = {
      body: { from: "USD", to: "EUR", amount: 100 },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validCode.mockResolvedValueOnce({
      success: true,
      isValid: true,
      supported_currency_codes: "USD, EUR",
    });

    fetchRates.mockResolvedValueOnce({
      conversion_rates: {}, // No conversion rates available
    });

    await convertCurrency(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Conversion rate for target currency 'EUR' is not available. ",
    });
  });

  it("should handle server errors", async () => {
    const mockRequest = {
      body: { from: "USD", to: "EUR", amount: 100 },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validCode.mockResolvedValueOnce({
      success: true,
      isValid: true,
      supported_currency_codes: "USD, EUR",
    });

    fetchRates.mockRejectedValueOnce(new Error("Server error"));

    await convertCurrency(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  });
});
