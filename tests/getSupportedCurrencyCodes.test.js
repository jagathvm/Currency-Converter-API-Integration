import { getSupportedCurrencyCodes } from "../src/services/apiService.js";
import { API_CONFIG } from "../src/config/apiConfig.js";

global.fetch = jest.fn(); // Mock the global fetch function

describe("getSupportedCurrencyCodes", () => {
  it("should return supported currency codes when the API call is successful", async () => {
    const mockResponse = {
      supported_codes: [
        ["USD", "United States Dollar"],
        ["EUR", "Euro"],
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getSupportedCurrencyCodes({
      status: () => ({
        json: () => null,
      }),
    });

    expect(result).toEqual({
      success: true,
      supported_codes: mockResponse.supported_codes,
    });
    expect(fetch).toHaveBeenCalledWith(API_CONFIG.STDCODE_URI);
  });

  it("should return an error response when the API fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    const result = await getSupportedCurrencyCodes({
      status: (statusCode) => ({
        json: () => ({ success: false, message: "API error" }),
      }),
    });

    expect(result.success).toBe(false);
    expect(fetch).toHaveBeenCalledWith(API_CONFIG.STDCODE_URI);
  });
});
