import "dotenv/config";

export const getRates = async (req, res) => {
  const base = req?.query?.base || "USD";
  const fetchUrl = `${process.env.API_URI}/${base}`;

  try {
    const response = await fetch(fetchUrl);
    const { result, base_code, conversion_rates } = await response.json();
    return res
      .status(200)
      .json({ result, base: base_code, rates: conversion_rates });
  } catch (error) {
    console.error(`An unexpected error occured while fetching rates: ${error}`);
    throw error;
  }
};
