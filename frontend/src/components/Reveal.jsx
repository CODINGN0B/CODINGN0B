import { motion, useReducedMotion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 28, className = "", as = "div", ...rest }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export const SectionLabel = ({ index, children, className = "" }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    {index && <span className="font-tech text-[10px] tracking-[0.3em] text-[color:var(--gold-deep)]">{index}</span>}
    <span className="h-px w-10 rule-gold" />
    <span className="label-tech">{children}</span>
  </div>
);
