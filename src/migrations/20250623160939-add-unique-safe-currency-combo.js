export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addConstraint("safe_balances", {
    fields: ["safe_id", "currency_id"],
    type: "unique",
    name: "unique_safe_currency_combination",
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeConstraint(
    "safe_balances",
    "unique_safe_currency_combination"
  );
};
