"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Tag } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { changeSubscription } from "@/actions/upgrade-action";
import { useUser } from "@clerk/nextjs"; // 👈 1. Import added

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // 👈 2. Get User Email dynamically
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // --- PLANS SETUP ---
  const planParam = searchParams.get("plan"); 
  const isBasic = planParam === "basic";
  
  const planName = isBasic ? "Basic Subscription" : "Pro Subscription";
  const planPrice = isBasic ? "$5.00" : "$12.99"; 
  const planDesc = isBasic ? "5 PDF summaries & Standard speed" : "Unlimited summaries, Notion export, & priority support";
  
  const badgeColor = isBasic ? "bg-gray-700" : "bg-[#635bff]";
  const buttonColor = isBasic ? "bg-gray-800 hover:bg-gray-900" : "bg-[#0074d4] hover:bg-[#006bbd]";

  // --- FORM STATES ---
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState(""); 
  const [country, setCountry] = useState("Pakistan");
  const [address, setAddress] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [showPromo, setShowPromo] = useState(false);

  // --- VALIDATION ---
  const isValidLuhn = (num: string) => {
    let arr = (num + "").split("").reverse().map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9, 0);
    sum += lastDigit;
    return sum % 10 === 0;
  };

  const validateForm = () => {
    const cleanNum = cardNumber.replace(/\s/g, "");
    
    if (cleanNum.length < 15 || !isValidLuhn(cleanNum)) {
      toast.error("Invalid Card Number.");
      return false;
    }

    const [expMonth, expYear] = expiry.replace(/\s/g, "").split("/").map(Number);
    if (!expMonth || !expYear || expMonth > 12 || expMonth < 1) {
        toast.error("Invalid Expiry Date.");
        return false;
    }
    
    // Future Date Check
    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().slice(-2));
    const currentMonth = now.getMonth() + 1;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        toast.error("Card has expired.");
        return false;
    }

    if (cvc.length < 3) { toast.error("Invalid CVC."); return false; }
    if (!nameOnCard.trim()) { toast.error("Name is required."); return false; }
    if (!address.trim()) { toast.error("Address is required."); return false; }

    return true;
  };

  // --- HANDLER ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return; 

    setLoading(true);
    
    try {
      const planType = isBasic ? "basic" : "pro";
      
      // Sending ALL Data to Backend
      const result = await changeSubscription({
          plan: planType,
          nameOnCard,
          country,
          address,
          saveInfo
      });

      if (result.success) {
        toast.success(`Payment Approved! Welcome to ${planName}. 🎉`);
        window.location.href = "/dashboard"; // Hard Refresh
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI HELPERS ---
  const formatCard = (e: any) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(val);
  };
  const formatExpiry = (e: any) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + " / " + val.substring(2);
    setExpiry(val);
  };

  return (
    <div className="grid lg:grid-cols-2 font-[-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Helvetica,Arial,sans-serif] text-[#30313d] bg-white lg:bg-transparent min-h-screen">
      
      {/* LEFT: SUMMARY (Gray) */}
      <div className="bg-[#f7f8f9] px-6 py-6 lg:px-12 lg:pt-8 lg:pb-12 border-r border-gray-200 flex flex-col order-2 lg:order-1 h-full">
        
        <div className="flex items-center gap-3 mb-4">
            <div onClick={() => router.back()} className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-500 text-[14px]">Summarie.ai</span>
            <span className="bg-[#ffc010] text-[#634316] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">TEST MODE</span>
        </div>

        <div className="mb-8">
            <p className="text-gray-500 font-medium mb-1 text-[14px]">Pay Summarie.ai</p>
            <h1 className="text-4xl font-bold text-[#1a1f36] tracking-tight">{planPrice}</h1>
        </div>

        <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 bg-white border border-gray-200 rounded-md flex items-center justify-center shrink-0 relative overflow-hidden">
                <div className={`${badgeColor} h-8 w-12 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-sm z-10`}>
                    {isBasic ? "BASIC" : "PRO"}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-medium text-[#1a1f36] text-[14px]">{planName}</h3>
                    <div className="font-medium text-[#1a1f36] text-[14px]">{planPrice}</div>
                </div>
                <p className="text-[13px] text-[#697386] mt-1 leading-normal">{planDesc}</p>
            </div>
        </div>

        {/* Promo Code Toggle */}
        <div className="mb-6">
            {!showPromo ? (
                 <button onClick={() => setShowPromo(true)} className="!bg-transparent !border-none !p-0 text-[#0074d4] font-medium text-[14px] flex items-center gap-2 hover:text-[#005ba8] cursor-pointer">
                    <Tag className="w-4 h-4" /> Add promotion code
                 </button>
            ) : (
                <div className="flex gap-3">
                    <Input placeholder="Promo Code" className="bg-white border-gray-300 h-9 text-sm" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <Button variant="outline" className="h-9 border-gray-300" onClick={() => toast.error("Invalid Code")}>Apply</Button>
                </div>
            )}
        </div>

        <div className="border-t border-gray-200 pt-5 space-y-3 flex-1">
            <div className="flex justify-between text-[#1a1f36] font-semibold text-[15px] mt-4 pt-4 border-t border-gray-200">
                <span>Total due</span>
                <span>{planPrice}</span>
            </div>
        </div>
      </div>

      {/* RIGHT: FORM (White) */}
      <div className="bg-white px-6 py-6 lg:px-12 lg:pt-8 flex flex-col order-1 lg:order-2 lg:min-h-[calc(100vh-80px)]">
        <div className="max-w-[480px] w-full mx-auto lg:mt-0">
            <h2 className="text-[20px] font-bold text-[#1a1f36] mb-6">Pay with card</h2>

            <form onSubmit={handlePayment} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#30313d]">Email</label>
                    {/* 👇 3. Updated Input: Use userEmail variable */}
                    <Input type="email" value={userEmail} readOnly className="h-[44px] bg-gray-50 text-gray-500" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#30313d]">Card information</label>
                    <div className="border border-gray-300 rounded-[5px] shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-[#0074d4] transition-all">
                        <Input 
                            placeholder="1234 1234 1234 1234" 
                            className="border-none rounded-none h-[44px] focus-visible:ring-0 px-3"
                            value={cardNumber} onChange={formatCard} maxLength={19} required
                        />
                        <div className="flex divide-x divide-gray-200 border-t border-gray-200">
                            <Input placeholder="MM / YY" className="border-none rounded-none h-[44px] focus-visible:ring-0 w-1/2" value={expiry} onChange={formatExpiry} maxLength={7} required />
                            <Input placeholder="CVC" className="border-none rounded-none h-[44px] focus-visible:ring-0 w-1/2" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))} maxLength={3} required />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#30313d]">Name on card</label>
                    <Input placeholder="Card Holder Name" className="h-[44px] border-gray-300 shadow-sm focus:border-[#0074d4] focus:ring-1 focus:ring-[#0074d4]" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#30313d]">Billing address</label>
                    <div className="relative">
                        <select className="flex h-[44px] w-full items-center justify-between rounded-t-[5px] border border-gray-300 bg-gray-50 px-3 py-2 text-[15px]" value={country} onChange={(e) => setCountry(e.target.value)}>
                            <option value="Pakistan">Pakistan</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                        </select>
                        <Input placeholder="Address" className="h-[44px] rounded-b-[5px] rounded-t-none border-gray-300 border-t-0 shadow-sm focus:border-[#0074d4] focus:ring-1 focus:ring-[#0074d4]" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                    <input type="checkbox" id="save-info" className="mt-1 h-4 w-4 rounded text-[#0074d4]" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
                    <label htmlFor="save-info" className="text-[13px] text-gray-500 leading-snug cursor-pointer select-none">
                        Save my info for secure 1-click checkout <br/>
                        <span className="text-gray-400 text-xs">Pay faster on Summarie.ai and thousands of sites.</span>
                    </label>
                </div>

                <Button type="submit" className={`w-full h-[44px] text-white font-semibold rounded-[5px] shadow-sm mt-4 text-[15px] ${buttonColor}`} disabled={loading}>
                    {loading ? "Processing..." : `Pay ${planPrice}`}
                </Button>

                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4">
                    <Lock className="w-3 h-3" /> Payments are secure and encrypted
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}