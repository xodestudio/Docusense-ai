export const pricingPlans = [
  {
    name: "Basic",
    price: 5,
    description: "Perfect for essential use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink:
      "Stripe Payment Link to be added soon, Pending activation as Stripe is not yet available for live accounts in Pakistan.",
    priceId:
      "Stripe Price ID to be added soon, pending activation as Stripe is not yet available for live accounts in Pakistan.",
  },
  {
    name: "Pro",
    price: 12.99,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink:
      "Stripe Payment Link to be added soon, Pending activation as Stripe is not yet available for live accounts in Pakistan.",
    priceId:
      "Stripe Price ID to be added soon, pending activation as Stripe is not yet available for live accounts in Pakistan.",
  },
];

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { type: "spring" as const, damping: 10, stiffness: 100 },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    } as const,
  },
};
