import "dotenv/config";

export const convertCurrency = async (req, res) => {
  const { from, to, amount } = req.body;
  const fetchUrl = `${process.env.API_URI}/${from}`;

  try {
    const response = await fetch(fetchUrl);
    const { conversion_rates } = await response.json();
    const conversionRateOfTarget = conversion_rates[to];
    const convertedAmount = amount * conversionRateOfTarget;

    return res.status(200).json({
      from: "USD",
      to: "EUR",
      amount: 100,
      convertedAmount,
    });
  } catch (error) {
    console.error(
      `An unexpected error occured while converting "${amount}" from "${from}" to "${to}". : ${error}`
    );
  }
};

export const convertCurrencyV2 = async (req, res) => {
  const { from, to, amount } = req.body;
  const fetchUrl = `${process.env.API_URI_V2}/pair/${from}/${to}/${amount}`;

  try {
    const response = await fetch(fetchUrl);
    const { conversion_result } = await response.json();

    return res.status(200).json({
      from: "USD",
      to: "EUR",
      amount: 100,
      convertedAmount: conversion_result,
    });
  } catch (error) {
    console.error(
      `An unexpected error occured while converting "${amount}" from "${from}" to "${to}". : ${error}`
    );
  }
};
