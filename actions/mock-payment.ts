"use server";

import { getDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const PRO_PRICE_ID = "price_1RA9yVCTlpmJdURCk8Oi1pwO";

export async function performMockPayment(priceId: string) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Please login first" };
  }

  const email = user.emailAddresses[0]?.emailAddress;

  // 👇 FIX 1: User ka naam Clerk se nikalo
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  if (!email) {
    return { success: false, error: "User email not found" };
  }

  try {
    const sql = await getDbConnection();
    const mockPaymentId = `pi_mock_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    const amountTotal = priceId === PRO_PRICE_ID ? 12900 : 4900;

    // 👇 FIX 2: Naam bhi pass karo function ko
    await createOrUpdateUser({
      sql,
      userId: user.id,
      userEmail: email,
      fullName: fullName, // <-- Ye add kiya
      priceId: priceId,
    });

    const mockSession = {
      id: mockPaymentId,
      amount_total: amountTotal,
      customer_email: email,
      status: "complete",
    };

    await createPayment({
      sql,
      session: mockSession,
      priceId: priceId,
      userEmail: email,
    });

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/pricing");

    return { success: true };
  } catch (error) {
    console.error("Mock Payment Failed:", error);
    return { success: false, error: "Payment failed." };
  }
}

async function createOrUpdateUser({
  sql,
  userId,
  userEmail,
  fullName, // <-- Receive name
  priceId,
}: {
  sql: any;
  userId: string;
  userEmail: string;
  fullName: string;
  priceId: string;
}) {
  try {
    const existingUser = await sql`SELECT * FROM users WHERE id = ${userId}`;

    if (existingUser.length === 0) {
      // 👇 FIX 3: INSERT query mein full_name add kiya
      await sql`
        INSERT INTO users (id, email, full_name, price_id, status, stripe_customer_id)
        VALUES (${userId}, ${userEmail}, ${fullName}, ${priceId}, 'active', ${`cus_mock_${userId}`})
      `;
    } else {
      // 👇 FIX 4: UPDATE query mein bhi full_name update karo
      await sql`
        UPDATE users 
        SET price_id = ${priceId}, status = 'active', full_name = ${fullName}
        WHERE id = ${userId}
      `;
    }
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error("Failed to update user record");
  }
}

async function createPayment({
  sql,
  session,
  priceId,
  userEmail,
}: {
  sql: any;
  session: any;
  priceId: string;
  userEmail: string;
}) {
  try {
    await sql`
      INSERT INTO payments (
        stripe_payment_id, 
        amount, 
        status, 
        price_id, 
        user_email
      )
      VALUES (
        ${session.id}, 
        ${session.amount_total}, 
        ${session.status}, 
        ${priceId}, 
        ${userEmail}
      )
    `;
  } catch (err) {
    console.error("Error creating payment record:", err);
    throw new Error("Failed to create payment record");
  }
}
