"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Check, CreditCard, Lock, ShieldCheck, Sparkles, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { changeSubscription } from "@/actions/upgrade-action";
import { useUser } from "@clerk/nextjs";
import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // 👈 New Success State
  
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // --- PLANS SETUP ---
  const planParam = searchParams.get("plan"); 
  const isBasic = planParam === "basic";
  const planName = isBasic ? "Basic Plan" : "Pro Plan";
  const planPrice = isBasic ? "$5.00" : "$12.99"; 
  const planFeatures = isBasic 
    ? ["5 PDF Summaries/mo", "Standard Speed", "Email Support"] 
    : ["Unlimited Summaries", "Priority AI Processing", "Notion Export", "24/7 Priority Support"];
  
  // --- FORM STATES ---
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState(""); 
  const [country, setCountry] = useState("Pakistan");
  const [address, setAddress] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  // --- VALIDATION & ERROR TOASTS ---
  const isValidLuhn = (num: string) => {
    let arr = (num + "").split("").reverse().map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9, 0);
    sum += lastDigit;
    return sum % 10 === 0;
  };

  const showError = (title: string, message: string) => {
      toast.error(
        <div className="flex flex-col gap-1">
            <span className="font-bold text-base">{title}</span>
            <span className="text-sm font-normal opacity-90">{message}</span>
        </div>,
        {
            className: "bg-red-50 border-red-200 text-red-800",
            duration: 4000,
            icon: <AlertCircle className="w-5 h-5 text-red-600" />
        }
      );
  };

  const validateForm = () => {
    const cleanNum = cardNumber.replace(/\s/g, "");
    if (cleanNum.length < 15 || !isValidLuhn(cleanNum)) {
      showError("Invalid Card", "Please enter a valid card number.");
      return false;
    }
    const [expMonth, expYear] = expiry.replace(/\s/g, "").split("/").map(Number);
    if (!expMonth || !expYear || expMonth > 12 || expMonth < 1) {
        showError("Invalid Date", "Expiration month must be between 01 and 12.");
        return false;
    }
    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().slice(-2));
    const currentMonth = now.getMonth() + 1;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        showError("Card Expired", "Your card has expired. Please use a valid card.");
        return false;
    }
    if (cvc.length < 3) { showError("Invalid CVC", "Please enter the 3-digit security code."); return false; }
    if (!nameOnCard.trim()) { showError("Missing Name", "Cardholder name is required."); return false; }
    if (!address.trim()) { showError("Missing Address", "Billing address is required."); return false; }

    return true;
  };

  // --- HANDLER ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return; 

    setLoading(true);
    
    try {
      const planType = isBasic ? "basic" : "pro";
      const result = await changeSubscription({
          plan: planType,
          nameOnCard,
          country,
          address,
          saveInfo
      });

      if (result.success) {
        // 👇 TRIGGER SUCCESS ANIMATION
        setSuccess(true);
        
        // Wait 3 seconds for animation, then redirect
        setTimeout(() => {
             window.location.href = "/dashboard"; 
        }, 3500);

      } else {
        showError("Transaction Failed", "The bank declined the transaction. Please try another card.");
      }
    } catch (error) {
      showError("System Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- FORMATTERS ---
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
    <div className="relative min-h-screen bg-background overflow-hidden text-foreground selection:bg-primary/20">
      
      {/* Background Ambience */}
      <BgGradient className="top-[-20%] left-[-10%] opacity-15 blur-[120px]" />
      <BgGradient className="bottom-[-20%] right-[-10%] opacity-15 blur-[120px] from-blue-500 to-cyan-500" />

      {/* 🚀 SUCCESS OVERLAY (Absolute Full Screen) */}
      <AnimatePresence>
        {success && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl px-4"
            >
                {/* Checkmark Animation */}
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-green-500 blur-[60px] opacity-20 rounded-full" />
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                        <Check className="h-16 w-16 text-white stroke-[4px]" />
                    </div>
                </motion.div>

                {/* Text Animation */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center space-y-2"
                >
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Payment Successful!</h1>
                    <p className="text-lg text-muted-foreground">You are now a <span className="text-primary font-bold">{planName}</span> member.</p>
                </motion.div>

                {/* Redirecting Progress Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 w-full max-w-xs"
                >
                    <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium">
                        <span>Redirecting to Dashboard...</span>
                        <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /></span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.8 }}
                            className="h-full bg-primary rounded-full"
                        />
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10 max-w-6xl">
        {/* Top Nav */}
        <div className="mb-10 flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} disabled={success} className="group gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent">
                <div className="p-1 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> 
                </div>
                <span className="font-medium">Back to Plans</span>
            </Button>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Test Mode</span>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT: SUMMARY */}
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-8"
          >
             <div className="rounded-[2rem] border border-white/20 bg-white/40 dark:bg-black/20 backdrop-blur-xl p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
                <div className="space-y-8 relative z-10">
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">You're upgrading to</h2>
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">{planPrice}</h1>
                            <span className="text-lg text-muted-foreground">/ month</span>
                        </div>
                    </div>

                    <div className={cn(
                        "relative p-5 rounded-2xl border transition-all duration-300",
                        isBasic ? "bg-muted/40 border-border" : "bg-gradient-to-br from-primary/10 to-purple-600/5 border-primary/20 shadow-lg shadow-primary/5"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-inner",
                                isBasic ? "bg-gradient-to-br from-gray-400 to-gray-600" : "bg-gradient-to-br from-primary to-purple-700"
                            )}>
                                {isBasic ? <ShieldCheck className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{planName}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Cancel anytime</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-medium text-foreground">What's included:</p>
                        <ul className="space-y-3">
                            {planFeatures.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                                    <div className="mt-0.5 p-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-t border-border/50 pt-6 flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Total due today</span>
                        <span className="font-bold text-xl">{planPrice}</span>
                    </div>
                </div>
             </div>
          </MotionDiv>

          {/* RIGHT: PAYMENT FORM */}
          <MotionDiv 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="bg-background rounded-[2rem] border border-border/50 p-6 lg:p-10 shadow-sm relative overflow-hidden">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Payment Details</h2>
                    <p className="text-muted-foreground">Enter your credentials to process the secure transaction.</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                            <Input value={userEmail} readOnly className="pl-10 bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Name on Card</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
                            <Input placeholder="e.g. Sarah Connor" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} className="pl-10 bg-background focus:ring-primary/20 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Card Information</Label>
                            <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                                <div className="h-4 w-6 bg-blue-600 rounded-[2px]" title="Visa"></div>
                                <div className="h-4 w-6 bg-red-500 rounded-[2px]" title="Mastercard"></div>
                            </div>
                        </div>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-primary" />
                            <Input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={formatCard} maxLength={19} className="pl-10 font-mono tracking-wide bg-background focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
                                <Input placeholder="MM / YY" value={expiry} onChange={formatExpiry} maxLength={7} className="pl-10 text-center bg-background focus:ring-primary/20 transition-all" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
                                <Input placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))} maxLength={3} type="password" className="pl-10 text-center bg-background focus:ring-primary/20 transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Billing Address</Label>
                        <div className="grid grid-cols-3 gap-2">
                             <select className="col-span-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={country} onChange={(e) => setCountry(e.target.value)}>
                                <option value="Pakistan">PK</option>
                                <option value="United States">US</option>
                                <option value="United Kingdom">UK</option>
                            </select>
                            <Input placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-2 bg-background focus:ring-primary/20 transition-all" />
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 py-3 px-4 rounded-xl bg-muted/30 border border-border/40">
                        <input type="checkbox" id="save-info" className="mt-1 h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary/20 accent-primary cursor-pointer" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
                        <label htmlFor="save-info" className="text-sm text-muted-foreground cursor-pointer select-none">
                            <span className="font-medium text-foreground block mb-0.5">Save payment details</span>
                            Securely save my information for 1-click checkout next time.
                        </label>
                    </div>

                    <Button type="submit" disabled={loading} className={cn(
                            "w-full h-14 text-base font-bold rounded-xl shadow-xl shadow-primary/20 transition-all duration-300",
                            "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 hover:scale-[1.01]",
                            "disabled:opacity-70 disabled:hover:scale-100 disabled:grayscale"
                    )}>
                        {loading ? <span className="flex items-center gap-2">Processing <Sparkles className="w-4 h-4 animate-spin" /></span> : <span className="flex items-center gap-2">Pay {planPrice} Now</span>}
                    </Button>
                </form>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}