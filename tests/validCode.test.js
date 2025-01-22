import { validCode } from "../src/helpers/apiHelper.js";
import { getSupportedCurrencyCodes } from "../src/services/apiService.js";

jest.mock("../src/services/apiService.js");

describe("validCode", () => {
  it("should validate a currency code correctly", async () => {
    const mockSupportedCodes = [
      ["USD", "United States Dollar"],
      ["EUR", "Euro"],
    ];

    getSupportedCurrencyCodes.mockResolvedValueOnce({
      success: true,
      supported_codes: mockSupportedCodes,
    });

    const result = await validCode("USD", {
      status: () => ({
        json: () => null,
      }),
    });

    expect(result).toEqual({
      success: true,
      isValid: true,
      supported_currency_codes: "USD, EUR",
    });
  });

  it("should return an error when the code is invalid", async () => {
    const mockSupportedCodes = [["EUR", "Euro"]];

    getSupportedCurrencyCodes.mockResolvedValueOnce({
      success: true,
      supported_codes: mockSupportedCodes,
    });

    const result = await validCode("XYZ", {
      status: () => ({
        json: () => null,
      }),
    });

    expect(result).toEqual({
      success: true,
      isValid: false,
      supported_currency_codes: "EUR",
    });
  });
});
