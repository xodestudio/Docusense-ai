"use server";

import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
) {
  const email = formData.get("email");

  // 1. Validate Email
  const validatedFields = emailSchema.safeParse({ email });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.email?.[0],
    };
  }

  // 2. Simulate Database Call (Yahan future mein Mailchimp/DB connect hoga)
  // Hum 1 second ka delay daal rahe hain taake loading feel ho
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("✅ New Subscriber:", validatedFields.data.email);

  return {
    success: true,
    message: "You've successfully subscribed to our newsletter!",
  };
}
