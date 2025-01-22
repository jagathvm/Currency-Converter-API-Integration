export const validateConversionInput = (input) => {
  // Extract 'from', 'to', and 'amount' from the request body
  const { from, to, amount } = input;

  // Ensure 'from' and 'to' are provided
  if (!from || !to)
    return {
      success: false,
      message: "Invalid input. Ensure 'from', 'to' currencies are provided.",
    };

  // Ensure 'from', 'to' are strings
  if (typeof from !== "string" || typeof to !== "string")
    return {
      success: false,
      message: "Invalid input. Ensure both 'from' and 'to' are strings.",
    };

  // Ensure 'amount' is a number and greater than 0
  if (typeof amount !== "number" || amount <= 0)
    return {
      success: false,
      message: "Invalid input. Ensure 'amount' is greater than 0.",
    };

  return { success: true, from, to, amount };
};
