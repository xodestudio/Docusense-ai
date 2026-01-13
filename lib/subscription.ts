import { getDbConnection } from "@/lib/db";

const DAY_IN_MS = 86_400_000;

// 👇 Aapke Price IDs (Payments.json se liye gaye hain)
const PRO_PRICE_ID = "price_1RA9yVCTlpmJdURCk8Oi1pwO";
const BASIC_PRICE_ID = "price_1RA9yVCTlpmJdURCo5eDA5T5";

export async function getUserSubscription(userId: string) {
  try {
    const sql = await getDbConnection();

    // 1. Query the USERS table directly (Based on your users.json)
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

    // 3. Check Status (users.json mein 'status' field hai)
    // Agar status active hai, tabhi valid manenge.
    const isActive = user.status === "active";

    if (!hasPriceId || !isActive) {
      return null;
    }

    // 4. Determine Plan
    // Agar Price ID Pro wala hai to 'pro', warna 'basic'
    const plan = user.price_id === PRO_PRICE_ID ? "pro" : "basic";

    // 5. Construct Response
    // Note: 'stripeCurrentPeriodEnd' aapke DB mein nahi hai.
    // Frontend ko khush karne ke liye hum kal ki date bhej rahe hain agar status active hai.
    const fakePeriodEnd = new Date(Date.now() + DAY_IN_MS);

    return {
      stripeSubscriptionId: "sub_derived_from_user", // Fake ID kyunki DB mein nahi hai
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
