// src/utils/dto.js
const unwrap = (u) => (u && typeof u.toJSON === "function" ? u.toJSON() : u);

export const toUserDTO = (input = {}) => {
  const user = unwrap(input);
  return {
    id: user?.id ?? null,
    name: user?.name ?? null,
    roleName: user?.Role?.name || user?.roleName || null,
    phone: user?.phone ?? null,
    email: user?.email ?? null,
    branch_id: user?.branch_id ?? null,
    company_id: user?.company_id ?? null,
    safe_id: user?.Safe?.id || user?.safe_id || null,
  };
};
