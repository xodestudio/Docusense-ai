"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

export async function changeSubscription(plan: string) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const userId = user?.id;
    const fullName = user?.firstName + " " + user?.lastName;

    if (!userEmail || !userId) {
      return { success: false, message: "User details not found" };
    }

    const sql = neon(process.env.DATABASE_URL!);

    // 👇 FIX: Yahan wo IDs dalo jo tumhari app ke constants mein hain
    // Agar tumhare pas Basic ki real ID hai to wahan wo likhna
    const status = "active";
    const priceId =
      plan === "basic"
        ? "price_1RA9yVCTlpmJdURCk8Oi1pwO_BASIC" // Basic ke liye unique ID
        : "price_1RA9yVCTlpmJdURCk8Oi1pwO"; // Pro ke liye Real ID

    const amount = plan === "basic" ? 500 : 1299;

    // Mock IDs
    const mockCustomerId = `cus_mock_${userId}`;
    const mockPaymentId = `pi_mock_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // 1. User Insert/Update
    await sql`
      INSERT INTO users (id, email, full_name, status, price_id, stripe_customer_id)
      VALUES (${userId}, ${userEmail}, ${fullName}, ${status}, ${priceId}, ${mockCustomerId})
      ON CONFLICT (email) 
      DO UPDATE SET 
        status = ${status}, 
        price_id = ${priceId},
        stripe_customer_id = ${mockCustomerId},
        updated_at = NOW();
    `;

    // 2. Payment Record
    await sql`
      INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email)
      VALUES (${amount}, 'complete', ${mockPaymentId}, ${priceId}, ${userEmail});
    `;

    // Cache clear
    revalidatePath("/dashboard");
    revalidatePath("/", "layout"); // Poori app refresh

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database update failed" };
  }
}
