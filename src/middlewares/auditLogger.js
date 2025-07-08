import db from "../models/index.js";

const { AuditLog } = db;
export const auditLogger = (config) => (req, res, next) => {
  res.on("finish", async () => {
    try {
      await AuditLog.create({
        user_id: req.user.id,
        company_id: req.user.company_id,
        branch_id: req.user.branch_id,
        action: config.action(req),
        table_name: config.table,
        record_id: config.getId(req),
        changes: config.getChanges ? config.getChanges(req, res) : null,
      });
    } catch (err) {
      console.error("AuditLog error:", err);
    }
  });
  next();
};
