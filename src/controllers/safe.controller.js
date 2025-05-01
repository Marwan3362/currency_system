import Safe from "../models/Safe.js";
import User from "../models/user/User.js";

class SafeController {
  static async getAllSafes(req, res) {
    try {
      const safes = await Safe.findAll({
        include: [
          {
            model: User,
            as: "userSafe",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ safes });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch safes", error: error.message });
    }
  }

  static async getSafeByUserId(req, res) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
      }

      const safe = await Safe.findOne({
        where: { user_id },
      });

      res.status(200).json({ safe });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch safe", error: error.message });
    }
  }

  static async getSafesByBranchId(req, res) {
    try {
      const { branch_id } = req.body;

      if (!branch_id) {
        return res.status(400).json({ message: "branch_id is required" });
      }

      const safes = await Safe.findAll({
        where: { branch_id },
      });

      res.status(200).json({ safes });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch safes", error: error.message });
    }
  }
}

export default SafeController;
