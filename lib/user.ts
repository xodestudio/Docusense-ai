import { pricingPlans } from "@/utils/constants";
import { getDbConnection } from "./db";
import { getUserUploadCount } from "./summaries";
import { User } from "@clerk/nextjs/server";

// ✅ 1. Helper: Price ID fetch karo
export async function getPriceIdForActiveUser(email: string) {
  const sql = await getDbConnection();
  const query =
    await sql`SELECT price_id FROM users WHERE email = ${email} AND status = 'active'`;
  return query?.[0]?.price_id || null;
}

// ✅ 2. Helper: Active Plan Check
export async function hasActivePlan(email: string) {
  const sql = await getDbConnection();
  const query =
    await sql`SELECT price_id, status FROM users WHERE email = ${email} AND status = 'active' AND price_id IS NOT NULL`;
  return query && query.length > 0;
}

// ✅ 3. Limit Check (Fixed for Basic/Pro)
export async function hasReachedUploadLimit(userId: string) {
  const sql = await getDbConnection();

  // User ki Price ID nikalo
  const userQuery = await sql`SELECT price_id FROM users WHERE id = ${userId}`;
  const priceId = userQuery?.[0]?.price_id;

  if (!priceId) {
    const uplaodCount = await getUserUploadCount(userId);
    return { hasReachedLimit: uplaodCount >= 5, uploadLimit: 5 };
  }

  // Plan Check
  const plan = pricingPlans.find((p) => p.priceId === priceId);
  const isPro = plan?.id === "pro";
  const isBasic = plan?.id === "basic";

  // Limits
  let limit = 5;
  if (isBasic) limit = 5;
  if (isPro) limit = 1000;

  // Pro users ke liye limit false
  if (isPro) return { hasReachedLimit: false, uploadLimit: limit };

  const uplaodCount = await getUserUploadCount(userId);
  return { hasReachedLimit: uplaodCount >= limit, uploadLimit: limit };
}

// 🚀 4. NEW FUNCTION: Plan Details for Header
export async function getUserPlan(email: string) {
  const priceId = await getPriceIdForActiveUser(email);

  if (!priceId) return null; // Koi plan nahi

  const plan = pricingPlans.find((p) => p.priceId === priceId);
  return {
    id: plan?.id, // 'basic' or 'pro'
    name: plan?.name, // 'Basic' or 'Pro'
    isPro: plan?.id === "pro",
    isBasic: plan?.id === "basic",
  };
}
