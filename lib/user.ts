import { getDbConnection } from "./db";
import { getUserUploadCount } from "./summaries";

// 👇 Aapki EXACT Price IDs
const PRO_PRICE_ID = "price_1RA9yVCTlpmJdURCk8Oi1pwO";
// const BASIC_PRICE_ID = "price_1RA9yVCTlpmJdURCo5eDA5T5";

// ✅ 1. Helper: Price ID fetch (Badge ke liye)
export async function getPriceIdForActiveUser(email: string) {
  try {
    const sql = await getDbConnection();
    const query = await sql`
      SELECT price_id 
      FROM users 
      WHERE email = ${email} 
      AND status = 'active'
    `;
    return query?.[0]?.price_id || null;
  } catch (error) {
    console.error("Error fetching price ID:", error);
    return null;
  }
}

// ✅ 2. Helper: Active Plan Check (Layout Guard ke liye)
export async function hasActivePlan(email: string) {
  try {
    const sql = await getDbConnection();
    const query = await sql`
      SELECT status 
      FROM users 
      WHERE email = ${email} 
      AND status = 'active' 
      AND price_id IS NOT NULL
    `;
    return query.length > 0;
  } catch (error) {
    console.error("Error checking active plan:", error);
    return false;
  }
}

// ✅ 3. Limit Check (Upload Page & Dashboard) - FIXED 🚀
export async function hasReachedUploadLimit(userId: string) {
  try {
    const sql = await getDbConnection();

    // 1. User ka Price ID nikalo
    const userQuery =
      await sql`SELECT price_id FROM users WHERE id = ${userId}`;
    const user = userQuery?.[0];

    // Default Limit (Basic/Free)
    let limit = 5;

    // 2. Explicitly Check for PRO ID
    if (user?.price_id === PRO_PRICE_ID) {
      limit = 1000; // Unlimited for Pro
    }

    // 3. Current Usage Count nikalo
    const uploadCount = await getUserUploadCount(userId);

    return {
      hasReachedLimit: uploadCount >= limit,
      uploadLimit: limit,
      currentUsage: uploadCount,
    };
  } catch (error) {
    console.error("Error checking upload limit:", error);
    // Error case mein safe side par block kar do ya 0 return kro
    return { hasReachedLimit: true, uploadLimit: 0 };
  }
}
