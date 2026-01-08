"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Tag, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { changeSubscription } from "@/actions/upgrade-action"; 

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // --- 🧠 DYNAMIC PLAN LOGIC ---
  // Default to 'pro' if no plan specified, or if plan is 'pro'
  const planParam = searchParams.get("plan");
  const isBasic = planParam === "basic";

  // Dynamic Details
  const planName = isBasic ? "Basic Subscription" : "Pro Subscription";
  const planPrice = isBasic ? "$5.00" : "$12.99";
  const planDescription = isBasic 
    ? "5 PDF summaries per month & Standard speed." 
    : "Unlock unlimited summaries, Notion export, and priority support.";
  
  // Theme Colors
  const badgeColor = isBasic ? "bg-gray-700" : "bg-[#635bff]";
  const buttonColor = isBasic ? "bg-gray-800 hover:bg-gray-900" : "bg-[#0074d4] hover:bg-[#006bbd]";

  // --- FORM STATES ---
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  // --- VALIDATION LOGIC ---
  const isValidLuhn = (num: string) => {
    let arr = (num + "").split("").reverse().map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9, 0);
    sum += lastDigit;
    return sum % 10 === 0;
  };

  const validateForm = () => {
    const cleanNum = cardNumber.replace(/\s/g, "");
    const cleanExpiry = expiry.replace(/\s/g, "");
    
    if (cleanNum.length < 15 || !isValidLuhn(cleanNum)) {
      toast.error("Invalid Card Number.");
      return false;
    }

    const [expMonth, expYear] = cleanExpiry.split("/").map(Number);
    if (!expMonth || !expYear || expMonth > 12 || expMonth < 1) {
        toast.error("Invalid Expiry Date.");
        return false;
    }
    
    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().slice(-2));
    const currentMonth = now.getMonth() + 1;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        toast.error("Card has expired.");
        return false;
    }

    if (cvc.length < 3) {
      toast.error("Invalid CVC.");
      return false;
    }
    return true;
  };

  // --- HANDLERS ---
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, "$1 "); 
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + " / " + val.substring(2);
    setExpiry(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value.replace(/\D/g, "").substring(0, 4));
  };

  // 🔥 MAIN PAYMENT HANDLER
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; 

    setLoading(true);
    
    try {
      // 1. Identify Plan
      const planType = isBasic ? "basic" : "pro";
      
      // 2. Call Server Action
      const result = await changeSubscription(planType);

      if (result.success) {
        toast.success(`Payment Approved! Welcome to ${isBasic ? 'Basic' : 'Pro'}. 🎉`);
        
        // ⚡ HARD REFRESH (To update Badge immediately)
        window.location.href = "/dashboard"; 
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 font-[-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Helvetica,Arial,sans-serif] text-[#30313d] bg-white lg:bg-transparent min-h-screen">
      
      {/* LEFT SIDE: Order Summary */}
      <div className="bg-[#f7f8f9] px-6 py-6 lg:px-12 lg:pt-8 lg:pb-12 border-r border-gray-200 flex flex-col order-2 lg:order-1 h-full">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-4">
            <div onClick={() => router.back()} className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-500 text-[14px]">Summarie.ai</span>
            <span className="bg-[#ffc010] text-[#634316] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                TEST MODE
            </span>
        </div>

        <div className="mb-8">
            <p className="text-gray-500 font-medium mb-1 text-[14px]">Pay Summarie.ai</p>
            {/* Dynamic Price */}
            <h1 className="text-4xl font-bold text-[#1a1f36] tracking-tight">{planPrice}</h1>
        </div>

        {/* Product Row */}
        <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 bg-white border border-gray-200 rounded-md flex items-center justify-center shrink-0 relative overflow-hidden">
                {/* Dynamic Badge */}
                <div className={`${badgeColor} h-8 w-12 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-sm z-10`}>
                    {isBasic ? "BASIC" : "PRO"}
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gray-50 to-transparent opacity-50"></div>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    {/* Dynamic Name */}
                    <h3 className="font-medium text-[#1a1f36] text-[14px]">{planName}</h3>
                    <div className="font-medium text-[#1a1f36] text-[14px]">{planPrice}</div>
                </div>
                {/* Dynamic Description */}
                <p className="text-[13px] text-[#697386] mt-1 leading-normal">
                    {planDescription}
                </p>
            </div>
        </div>

        {/* Promo Code */}
        <div className="mb-6">
            {!showPromo ? (
                 <button 
                    onClick={() => setShowPromo(true)} 
                    className="!bg-transparent !border-none !p-0 text-[#0074d4] font-medium text-[14px] flex items-center gap-2 hover:text-[#005ba8] transition-colors cursor-pointer focus:outline-none"
                 >
                    <Tag className="w-4 h-4" /> Add promotion code
                 </button>
            ) : (
                <div className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Input 
                        placeholder="Promo Code" 
                        className="bg-white border-gray-300 h-9 text-sm focus:border-[#0074d4] focus:ring-1 focus:ring-[#0074d4]"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button 
                        variant="outline" 
                        className="h-9 border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
                        onClick={() => toast.error("Invalid Promo Code")}
                    >
                        Apply
                    </Button>
                </div>
            )}
        </div>

        <div className="border-t border-gray-200 pt-5 space-y-3 flex-1">
            <div className="flex justify-between text-[14px] text-[#697386]">
                <span>Subtotal</span>
                <span>{planPrice}</span>
            </div>
            <div className="flex justify-between text-[#1a1f36] font-semibold text-[15px] mt-4 pt-4 border-t border-gray-200">
                <span>Total due</span>
                <span>{planPrice}</span>
            </div>
        </div>

        <div className="mt-8 lg:mt-auto pt-6 text-[12px] text-gray-400 flex items-center gap-4">
            <span className="flex items-center gap-1">Powered by <span className="font-bold text-gray-500 text-[13px]">stripe</span></span>
            <span className="border-l border-gray-300 pl-4">Terms</span>
            <span>Privacy</span>
        </div>
      </div>

      {/* RIGHT SIDE: Payment Form */}
      <div className="bg-white px-6 py-6 lg:px-12 lg:pt-8 flex flex-col order-1 lg:order-2 lg:min-h-[calc(100vh-80px)]">
        <div className="max-w-[480px] w-full mx-auto lg:mt-0">
            
            <h2 className="text-[20px] font-bold text-[#1a1f36] mb-6">Pay with card</h2>

            <form onSubmit={handlePayment} className="space-y-5">
                
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[13px] font-medium text-[#30313d]">Email</label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="user@example.com"
                        className="h-[44px] rounded-[5px] border-gray-300 shadow-sm focus:border-[#0074d4] focus:ring-1 focus:ring-[#0074d4] transition-all placeholder:text-gray-400"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#30313d]">Card information</label>
                    <div className="border border-gray-300 rounded-[5px] shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-[#0074d4] focus-within:border-[#0074d4] transition-all">
                        <div className="relative border-b border-gray-200">
                            <Input 
                                placeholder="1234 1234 1234 1234" 
                                className="border-none rounded-none h-[44px] focus-visible:ring-0 px-3 bg-transparent text-[15px] placeholder:text-gray-400"
                                required
                                value={cardNumber}
                                onChange={handleCardChange}
                                maxLength={19}
                            />
                            <div className="absolute right-3 top-3 flex gap-1.5 opacity-70">
                                <svg className="h-5 w-8" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#F0F2F5"/><path d="M13.4 13.5H11.5L12.5 7.5H14.4L13.4 13.5Z" fill="#2566AF"/><path d="M20.2 7.6C19.8 7.5 18.7 7.4 18 7.4C16.3 7.4 15.1 8.3 15.1 9.9C15.1 11.1 16.2 11.7 17 12.1C17.9 12.5 18.2 12.8 18.2 13.3C18.2 14 17.3 14.3 16.5 14.3C15.7 14.3 14.7 14.1 14 13.8L13.7 15.6C14.4 15.9 15.8 16.1 16.8 16.1C18.6 16.1 19.9 15.2 19.9 13.7C19.9 12.1 18.4 11.5 17.7 11.2C17 10.8 16.8 10.6 16.8 10.1C16.8 9.6 17.4 9.3 18.1 9.3C18.7 9.3 19.5 9.4 20.1 9.7L20.2 7.6Z" fill="#2566AF"/><path d="M23.9 16H25.6L24.1 7.5H22.4C22 7.5 21.6 7.7 21.5 8.1L18.3 15.9H20.3L20.7 14.8H23.3L23.5 16ZM21.2 13.4L22.2 10.4L22.8 13.4H21.2Z" fill="#2566AF"/><path d="M28 15.9H29.6L28.1 7.5H26.5L25.4 12.7L24.8 9.8C24.8 9.8 24.3 8 24.1 7.6C24 7.4 23.9 7.4 23.9 7.4H24L24.1 7.9L25.3 13.9L26.6 7.5H28V15.9Z" fill="#2566AF"/><path d="M10 7.5L8.5 15.9H6.8L8.3 7.5H10Z" fill="#2566AF"/><path d="M5.1 7.5H3.2L0 15.9H1.9L2.3 14.8C2.3 14.8 5.7 14.7 6.4 14.7C6.1 15.9 5.8 15.9 5.8 15.9H7.6L9.6 7.5H5.1Z" fill="#2566AF"/></svg>
                            </div>
                        </div>
                        <div className="flex divide-x divide-gray-200">
                            <Input 
                                placeholder="MM / YY" 
                                className="border-none rounded-none h-[44px] focus-visible:ring-0 px-3 bg-transparent w-1/2 text-[15px] placeholder:text-gray-400"
                                required
                                value={expiry}
                                onChange={handleExpiryChange}
                                maxLength={7}
                            />
                            <div className="relative w-1/2">
                                <Input 
                                    placeholder="CVC" 
                                    className="border-none rounded-none h-[44px] focus-visible:ring-0 px-3 bg-transparent text-[15px] placeholder:text-gray-400"
                                    required
                                    value={cvc}
                                    onChange={handleCvcChange}
                                    maxLength={4}
                                />
                                <CreditCard className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-[13px] font-medium text-[#30313d]">Name on card</label>
                    <Input 
                        id="name" 
                        placeholder="Ali Haider" 
                        className="h-[44px] rounded-[5px] border-gray-300 shadow-sm focus:border-[#0074d4] focus:ring-1 focus:ring-[#0074d4] transition-all placeholder:text-gray-400"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="country" className="text-[13px] font-medium text-[#30313d]">Billing address</label>
                    <div className="relative">
                        <select 
                            id="country"
                            className="flex h-[44px] w-full items-center justify-between rounded-t-[5px] border border-gray-300 bg-gray-50 px-3 py-2 text-[15px] text-[#30313d] focus:outline-none focus:ring-1 focus:ring-[#0074d4] focus:border-[#0074d4]"
                        >
                            <option>Pakistan</option>
                            <option>United States</option>
                            <option>United Kingdom</option>
                        </select>
                        <Input 
                            placeholder="Address" 
                            className="h-[44px] rounded-b-[5px] rounded-t-none border-gray-300 border-t-0 shadow-sm focus:border-[#0074d4] focus:ring-1 focus:ring-[#0074d4] transition-all placeholder:text-gray-400"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                    <input type="checkbox" id="save-info" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0074d4] focus:ring-[#0074d4]" />
                    <label htmlFor="save-info" className="text-[13px] text-gray-500 leading-snug cursor-pointer select-none">
                        Save my info for secure 1-click checkout <br/>
                        <span className="text-gray-400 text-xs">Pay faster on Summarie.ai and thousands of sites.</span>
                    </label>
                </div>

                <Button 
                    type="submit" 
                    className={`w-full h-[44px] text-white font-semibold rounded-[5px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all mt-4 text-[15px] ${buttonColor}`}
                    disabled={loading}
                >
                    {loading ? "Processing..." : `Pay ${planPrice}`}
                </Button>

                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4">
                    <Lock className="w-3 h-3" />
                    Payments are secure and encrypted
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}