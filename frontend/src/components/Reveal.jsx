import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 36, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const ChapterTag = ({ no, en, tc }) => (
  <div className="flex items-center gap-4" data-testid={`chapter-tag-${no}`}>
    <span className="font-tech text-xs tracking-[0.3em] text-[#00F3FF]">{no}</span>
    <span className="h-px w-12 bg-[#D4AF37]/60" />
    <span className="font-tech text-xs uppercase tracking-[0.3em] text-zinc-400">
      {en} <span className="ml-2 text-[#D4AF37]/80">{tc}</span>
    </span>
  </div>
);
