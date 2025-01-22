import { fetchRates } from "../src/services/apiService.js";
import { API_CONFIG } from "../src/config/apiConfig.js";

global.fetch = jest.fn(); // Mock the global fetch function

describe("fetchRates", () => {
  it("should return the correct rates when the API call is successful", async () => {
    // Mock the API response
    const mockResponse = {
      result: "success",
      base_code: "USD",
      conversion_rates: { EUR: 0.85, GBP: 0.75 },
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchRates("USD", {
      status: () => ({
        json: () => null,
      }),
    });

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URI}/USD`);
  });
});
