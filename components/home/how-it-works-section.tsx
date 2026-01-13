import { FileText, Upload, MoveRight, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { MotionDiv, MotionH2, MotionH3 } from "../common/motion-wrapper";
import BgGradient from "../common/bg-gradient"; 

type Step = {
  icon: ReactNode;
  label: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: <Upload size={40} strokeWidth={1.5} />,
    label: "Upload Document",
    description: "Drag & drop your PDF. We handle contracts, research papers, and reports securely.",
  },
  {
    icon: <Sparkles size={40} strokeWidth={1.5} />,
    label: "AI Processing",
    description:
      "Our Gemini 2.5 Pro model scans every page instantly to identify key concepts and context.",
  },
  // 👇 Step 3 Updated: Chat removed, replaced with Summary
  {
    icon: <FileText size={40} strokeWidth={1.5} />,
    label: "Get Instant Summary",
    description: "Receive a structured summary with key takeaways, saving you hours of reading time.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      
      {/* 1. Background Gradient (Purple Theme) */}
      <BgGradient className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2. Header */}
        <div className="text-center mb-16">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold text-sm uppercase tracking-wider mb-3 text-primary"
          >
            Simple Workflow
          </MotionH2>
          <MotionH3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-bold text-3xl md:text-4xl max-w-2xl mx-auto text-foreground"
          >
            From static PDF to <span className="text-primary">concise insights</span> in 3 steps
          </MotionH3>
        </div>

        {/* 3. Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <MotionDiv
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="relative flex flex-col items-center"
            >
              <StepItem {...step} index={idx + 1} />
              
              {/* Connector Arrow (Desktop Only) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] z-0">
                   <div className="w-full border-t-2 border-dashed border-primary/20" />
                   <MoveRight className="absolute -right-2 -top-2.5 text-primary/40 w-5 h-5" />
                </div>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ icon, label, description, index }: Step & { index: number }) {
  return (
    <div className="group relative z-10 flex flex-col items-center text-center w-full max-w-sm">
      
      {/* Icon Circle */}
      <div className="mb-6 relative flex items-center justify-center h-24 w-24 rounded-3xl bg-white border border-border shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/25 group-hover:border-primary/50 dark:bg-black/40">
        
        {/* Number Badge */}
        <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-background">
            {index}
        </div>
        
        <div className="text-muted-foreground transition-colors duration-300 group-hover:text-primary">
            {icon}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 px-4">
        <h4 className="font-bold text-xl text-foreground">{label}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
        </p>
      </div>
    </div>
  );
}