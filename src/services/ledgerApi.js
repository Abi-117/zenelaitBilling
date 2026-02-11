import API from "./api"; // your Axios instance with JWT

/**
 * Fetch ledger entries for a supplier (or all if no supplierId)
 * Each entry should have:
 *  - date: string
 *  - reference: string
 *  - description: string
 *  - debit: number
 *  - credit: number
 *  - balance: number
 */
export const fetchLedgerEntries = async (supplierId = "") => {
  try {
    const url = supplierId ? `/ledger/${supplierId}` : "/ledger";
    const { data } = await API.get(url);

    // Map numbers safely
    return (data || []).map((e) => ({
      ...e,
      debit: Number(e.debit ?? 0),
      credit: Number(e.credit ?? 0),
      balance: Number(e.balance ?? 0),
    }));
  } catch (err) {
    console.error("Failed to fetch ledger entries:", err);
    return [];
  }
};
