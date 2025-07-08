import {
  getAllSafes,
  getSafeById,
  getSafeByUserId,
  getSafeWithBalances,
  addBalanceToUserSafe,
} from "../services/safe.services.js";

export const fetchAllSafes = async (req, res) => {
  const { roleName, branch_id, company_id, id: user_id } = req.user;

  try {
    const safes = await getAllSafes(roleName, branch_id, company_id, user_id);
    res.status(200).json({ message: "Safes fetched successfully", safes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch safes", error: error.message });
  }
};

export const fetchSafeById = async (req, res) => {
  const { safeId } = req.params;
  const { roleName, branch_id, company_id, id: user_id } = req.user;

  try {
    const safe = await getSafeById(
      Number(safeId),
      roleName,
      branch_id,
      company_id,
      user_id
    );
    if (!safe)
      return res.status(403).json({ message: "Access denied or not found" });

    res.status(200).json({ message: "Safe fetched successfully", safe });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch safe", error: error.message });
  }
};

export const fetchSafeByUserId = async (req, res) => {
  const { userId } = req.params;
  const { roleName, branch_id, company_id, id: user_id } = req.user;

  try {
    const safe = await getSafeByUserId(
      Number(userId),
      roleName,
      branch_id,
      company_id,
      user_id
    );
    if (!safe)
      return res.status(403).json({ message: "Access denied or not found" });

    res.status(200).json({ message: "Safe fetched successfully", safe });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch safe by user", error: error.message });
  }
};

export const fetchSafeWithBalances = async (req, res) => {
  const { safeId } = req.params;
  const { roleName, id: user_id, branch_id, company_id } = req.user;

  try {
    const safe = await getSafeWithBalances(
      Number(safeId),
      roleName,
      user_id,
      branch_id,
      company_id
    );
    if (!safe)
      return res.status(403).json({ message: "Access denied or not found" });

    res
      .status(200)
      .json({ message: "Safe with balances fetched successfully", safe });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch safe with balances",
      error: error.message,
    });
  }
};

export const addBalanceToSafeHandler = async (req, res) => {
  try {
    const result = await addBalanceToUserSafe(req.body, req.user);
    res.status(200).json({ message: "Balance added successfully", ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
