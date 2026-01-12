import { parseEmojiPoint, parsePoint } from "@/utils/summary-helper";
import { MotionDiv } from "../common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/constants";
import { cn } from "@/lib/utils";

const EmojiPoint = ({ point }: { point: string }) => {
  const { emoji, text } = parseEmojiPoint(point) ?? {};
  return (
    <MotionDiv
      variants={itemVariants}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-white/50 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-white/80 hover:shadow-md hover:shadow-primary/5"
    >
      {/* Side Accent Line (Hover par dikhegi) */}
      <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative flex items-start gap-4">
        {/* Emoji Container */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-xl group-hover:scale-110 transition-transform duration-300">
            {emoji}
        </div>
        
        {/* Text */}
        <p className="text-base lg:text-lg leading-relaxed text-foreground/90 font-medium">
          {text}
        </p>
      </div>
    </MotionDiv>
  );
};

const RegularPoint = ({ point }: { point: string }) => {
  return (
    <MotionDiv
      variants={itemVariants}
      className="group relative rounded-xl border border-border/30 bg-white/40 p-4 transition-all duration-300 hover:bg-white/60 hover:border-primary/10"
    >
      <p className="text-base lg:text-lg leading-relaxed text-muted-foreground text-left group-hover:text-foreground/80 transition-colors">
        {point}
      </p>
    </MotionDiv>
  );
};

export default function ContentSection({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <MotionDiv
      variants={containerVariants}
      key={points.join("")}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-3"
    >
      {points.map((point, index) => {
        const { isMainPoint, hasEmoji, isEmpty } = parsePoint(point);

        if (isEmpty) return null;

        if (hasEmoji || isMainPoint) {
          return <EmojiPoint key={`point-${index}`} point={point} />;
        }
        return <RegularPoint key={`point-${index}`} point={point} />;
      })}
    </MotionDiv>
  );
}