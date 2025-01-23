import { validCode } from "../src/helpers/apiHelper.js";
import { getSupportedCurrencyCodes } from "../src/services/apiService.js";

jest.mock("../src/services/apiService.js");

describe("validCode", () => {
  it("should validate a currency code correctly", async () => {
    // Mock the response for valid currency codes
    getSupportedCurrencyCodes.mockResolvedValue({
      success: true,
      supported_codes: [
        ["USD", "United States Dollar"],
        ["EUR", "Euro"],
      ],
    });

    const result = await validCode("USD");

    expect(result).toEqual({
      success: true,
      isValid: true,
    });
  });

  it("should return an error when the code is invalid", async () => {
    // Mock the response for invalid currency codes
    getSupportedCurrencyCodes.mockResolvedValue({
      success: true,
      supported_codes: [
        ["USD", "United States Dollar"],
        ["EUR", "Euro"],
      ],
    });

    const result = await validCode("GBP");

    expect(result).toEqual({
      success: true,
      isValid: false,
      supported_currency_codes: "USD, EUR",
    });
  });

  it("should return an error when the API request fails", async () => {
    // Mock the API failure response
    getSupportedCurrencyCodes.mockResolvedValue({
      success: false,
    });

    const result = await validCode("USD");

    expect(result).toEqual({
      success: false,
      isValid: false,
    });
  });
});

// describe("validCode", () => {
//   it("should validate a currency code correctly", async () => {
//     const mockSupportedCodes = [
//       ["USD", "United States Dollar"],
//       ["EUR", "Euro"],
//     ];

//     getSupportedCurrencyCodes.mockResolvedValueOnce({
//       success: true,
//       supported_codes: mockSupportedCodes,
//     });

//     const result = await validCode("USD", {
//       status: () => ({
//         json: () => null,
//       }),
//     });

//     expect(result).toEqual({
//       success: true,
//       isValid: true,
//       supported_currency_codes: [
//         ["USD", "United States Dollar"],
//         ["EUR", "Euro"],
//       ],
//     });
//   });

//   it("should return an error when the code is invalid", async () => {
//     const mockSupportedCodes = [["EUR", "Euro"]];

//     getSupportedCurrencyCodes.mockResolvedValueOnce({
//       success: true,
//       supported_codes: mockSupportedCodes,
//     });

//     const result = await validCode("XYZ", {
//       status: () => ({
//         json: () => null,
//       }),
//     });

//     expect(result).toEqual({
//       success: true,
//       isValid: false,
//       supported_currency_codes: "EUR",
//     });
//   });
// });
