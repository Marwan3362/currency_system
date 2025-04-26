import Currency from "../models/Currency.js";

const currencies = [
  {
    code: "USD",
    name: "US Dollar",
    name_ar: "دولار أمريكي",
    symbol: "$",
    exchange_rate: 1,
  },
  {
    code: "EUR",
    name: "Euro",
    name_ar: "يورو",
    symbol: "€",
    exchange_rate: 0.93,
  },
  {
    code: "EGP",
    name: "Egyptian Pound",
    name_ar: "جنيه مصري",
    symbol: "ج.م",
    exchange_rate: 52.0,  },
  {
    code: "GBP",
    name: "British Pound",
    name_ar: "جنيه إسترليني",
    symbol: "£",
    exchange_rate: 0.8,
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    name_ar: "ريال سعودي",
    symbol: "﷼",
    exchange_rate: 3.75,
  },
  {
    code: "AED",
    name: "UAE Dirham",
    name_ar: "درهم إماراتي",
    symbol: "د.إ",
    exchange_rate: 3.67,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    name_ar: "ين ياباني",
    symbol: "¥",
    exchange_rate: 154.5,
  },
  {
    code: "TRY",
    name: "Turkish Lira",
    name_ar: "ليرة تركية",
    symbol: "₺",
    exchange_rate: 32.5,
  },
];

const seedCurrencies = async () => {
  try {
    for (const currency of currencies) {
      await Currency.findOrCreate({
        where: { code: currency.code },
        defaults: currency,
      });
    }

    console.log("Currencies seeded successfully.");
  } catch (error) {
    console.error("Error seeding currencies:", error);
  }
};

export default seedCurrencies;
