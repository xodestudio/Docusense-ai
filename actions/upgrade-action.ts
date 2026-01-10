"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

// Interface
interface PaymentDetails {
  plan: string;
  nameOnCard: string;
  country: string;
  address: string;
  saveInfo: boolean;
}

export async function changeSubscription(details: PaymentDetails) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const userId = user?.id;

    const fullName =
      details.nameOnCard || user?.firstName + " " + user?.lastName;

    if (!userEmail || !userId)
      return { success: false, message: "User not found" };

    const sql = neon(process.env.DATABASE_URL!);

    const status = "active";

    // 🛠️ FIX: Yahan ASLI IDs daal di hain (Tumhari constants file wali)
    const priceId =
      details.plan === "basic"
        ? "price_1RA9yVCTlpmJdURCo5eDA5T5" // ✅ REAL BASIC ID
        : "price_1RA9yVCTlpmJdURCk8Oi1pwO"; // ✅ REAL PRO ID

    const amount = details.plan === "basic" ? 500 : 1299;
    const mockCustomerId = `cus_mock_${userId}`;
    const mockPaymentId = `pi_mock_${Date.now()}`;

    // 1. UPDATE USER
    await sql`
      INSERT INTO users (id, email, full_name, status, price_id, stripe_customer_id)
      VALUES (${userId}, ${userEmail}, ${fullName}, ${status}, ${priceId}, ${mockCustomerId})
      ON CONFLICT (email) 
      DO UPDATE SET 
        status = ${status}, 
        price_id = ${priceId},
        full_name = ${fullName},
        updated_at = NOW();
    `;

    // 2. INSERT PAYMENT
    await sql`
      INSERT INTO payments (
        amount, status, stripe_payment_id, price_id, user_email, 
        customer_name, billing_country, billing_address, save_info
      )
      VALUES (
        ${amount}, 'complete', ${mockPaymentId}, ${priceId}, ${userEmail},
        ${details.nameOnCard}, ${details.country}, ${details.address}, ${details.saveInfo}
      );
    `;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed" };
  }
}
