import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { IMAGES, scrollToId } from "@/lib/site";

const ITEMS = [
  {
    category: "Precision Metal Components",
    body: "Metal parts produced to supplied drawings, dimensions and finishing requirements.",
    image: IMAGES.products.metal,
    alt: "Machined metal components collected after production",
    span: "lg:col-span-7",
  },
  {
    category: "Plastic Components",
    body: "Plastic parts manufactured for functional and assembly applications.",
    image: IMAGES.products.plastic,
    alt: "Plastic production equipment on a manufacturing line",
    span: "lg:col-span-5",
  },
  {
    category: "Custom Industrial Components",
    body: "Components manufactured for industrial assemblies and equipment.",
    image: IMAGES.products.industrial,
    alt: "Flat formed metal components arranged after stamping",
    span: "lg:col-span-5",
  },
  {
    category: "Custom Manufacturing",
    body: "Production arranged around the material, tolerance and volume stated in your enquiry.",
    image: IMAGES.products.custom,
    alt: "Metal component being machined on a lathe",
    span: "lg:col-span-7",
  },
];

export default function Products() {
  return (
    <section
      id="products"
      className="relative border-t border-white/5 bg-[#0a0c0e] py-24 md:py-32"
      data-testid="products-section"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <SectionLabel index="04">Products</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 max-w-3xl font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
            Precision Components. Built to Specification.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-500">
            Representative categories. Product imagery and descriptions are placeholders intended to be
            replaced with the company&apos;s own photography.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {ITEMS.map((item, i) => (
            <Reveal key={item.category} delay={0.06 * i} className={item.span}>
              <button
                type="button"
                onClick={() => scrollToId("#quote")}
                data-testid={`product-card-${i}`}
                className="group relative block h-[380px] w-full overflow-hidden rounded-lg border border-white/[0.07] text-left md:h-[460px]"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,10,0.92),rgba(6,8,10,0.35)_55%,rgba(6,8,10,0.2))] transition-opacity duration-500 group-hover:opacity-[0.88]" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7">
                  <span className="block">
                    <span className="label-tech">Category</span>
                    <span className="mt-2 block font-display text-xl font-medium uppercase tracking-[0.05em] text-white md:text-2xl">
                      {item.category}
                    </span>
                    <span className="mt-3 block max-w-sm text-sm leading-relaxed text-zinc-400">
                      {item.body}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/15 bg-black/30 text-zinc-200 transition-[transform,border-color] duration-300 group-hover:translate-x-1 group-hover:border-[color:var(--steel)]">
                    <ArrowUpRight size={16} />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
