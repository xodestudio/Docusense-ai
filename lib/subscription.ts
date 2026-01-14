import { getDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// 👇 Aapke Price IDs
const PRO_PRICE_ID = "price_1RA9yVCTlpmJdURCk8Oi1pwO";
const BASIC_PRICE_ID = "price_1RA9yVCTlpmJdURCo5eDA5T5";

export async function getUserSubscription(userId: string) {
  try {
    const sql = await getDbConnection();

    // 1. Query the USERS table directly
    const rows = await sql`
      SELECT 
        id,
        email,
        price_id, 
        status, 
        stripe_customer_id
      FROM users 
      WHERE id = ${userId}
    `;

    const user = rows[0];

    if (!user) {
      return null;
    }

    // 2. Check if user has a valid Price ID
    const hasPriceId =
      user.price_id &&
      (user.price_id === PRO_PRICE_ID || user.price_id === BASIC_PRICE_ID);

    // 3. Check Status
    const isActive = user.status === "active";

    if (!hasPriceId || !isActive) {
      return null;
    }

    // 4. Determine Plan
    const plan = user.price_id === PRO_PRICE_ID ? "pro" : "basic";

    const fakePeriodEnd = new Date(Date.now() + 86_400_000); // 1 Day buffer

    return {
      stripeSubscriptionId: "sub_derived_from_user",
      stripeCurrentPeriodEnd: fakePeriodEnd,
      stripeCustomerId: user.stripe_customer_id,
      stripePriceId: user.price_id,
      plan: plan,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return null;
  }
}

// 👇 NEW FUNCTION: Upload Size Limit Logic
export async function getUserUploadLimit() {
  const user = await currentUser();

  if (!user?.id) {
    // Fallback: Default to 10MB if no user found
    return { isPro: false, maxSizeBytes: 10 * 1024 * 1024, label: "10MB" };
  }

  try {
    const sql = await getDbConnection();

    // Check Price ID and Status directly
    const rows =
      await sql`SELECT price_id, status FROM users WHERE id = ${user.id}`;
    const userData = rows[0];

    // Logic: User is PRO only if price_id matches AND status is active
    const isPro =
      userData &&
      userData.price_id === PRO_PRICE_ID &&
      userData.status === "active";

    return {
      isPro,
      // ⚡ Pro: 25MB, Basic: 10MB
      maxSizeBytes: isPro ? 25 * 1024 * 1024 : 10 * 1024 * 1024,
      label: isPro ? "25MB" : "10MB",
    };
  } catch (error) {
    console.error("Error checking upload limit:", error);
    // Default to Basic on error
    return { isPro: false, maxSizeBytes: 10 * 1024 * 1024, label: "10MB" };
  }
}
