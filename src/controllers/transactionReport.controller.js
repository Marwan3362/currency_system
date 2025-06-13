import sequelize from "../config_old/db.js";

class TransactionReportController {
  static async getUnifiedTransactions(req, res) {
    try {
      const { startDate, endDate, safe_id, currency_id, type } = req.body;

      if (!type || !["in", "out"].includes(type)) {
        return res.status(400).json({
          message: "Please specify a valid transaction type: 'in' or 'out'.",
        });
      }

      const replacements = {
        startDate: startDate || "2000-01-01",
        endDate: endDate || new Date().toISOString().split("T")[0],
        safe_id,
        currency_id,
      };

      let query = "";

      if (type === "in") {
        query = `
          SELECT 
            st.id,
            st.date,
            'in' AS type,
            NULL AS safe_id,
            st.from_safe_id,
            st.to_safe_id,
            st.currency_id AS currency_id,
            st.amount,
            st.description,
            NULL AS created_by
          FROM safe_transfers st
          WHERE st.status = 'approved'
            AND st.date BETWEEN :startDate AND :endDate
            ${
              safe_id
                ? "AND (st.from_safe_id = :safe_id OR st.to_safe_id = :safe_id)"
                : ""
            }
            ${currency_id ? "AND st.currency_id = :currency_id" : ""}
          ORDER BY st.date DESC
          LIMIT 100;
        `;
      }

      if (type === "out") {
        query = `
          SELECT 
            t.id,
            t.date,
            'out' AS type,
            t.safe_id,
            NULL AS from_safe_id,
            NULL AS to_safe_id,
            t.currency_id_from AS currency_id,
            t.amount,
            t.description,
            u.name AS created_by
          FROM transactions t
          LEFT JOIN users u ON u.id = t.user_id
          WHERE t.type = 'out'
            AND t.date BETWEEN :startDate AND :endDate
            ${safe_id ? "AND t.safe_id = :safe_id" : ""}
            ${currency_id ? "AND t.currency_id_from = :currency_id" : ""}
          ORDER BY t.date DESC
          LIMIT 100;
        `;
      }

      const result = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      res.status(200).json({ data: result });
    } catch (error) {
      console.error("Report error:", error);
      res.status(500).json({
        message: "An error occurred while generating the report.",
        error: error.message,
      });
    }
  }
}

export default TransactionReportController;
