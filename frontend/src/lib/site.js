export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const COMPANY = {
  name: "Yue Fung Metal Plastic Products Co. Ltd.",
  short: "YUE FUNG",
  sub: "METAL PLASTIC PRODUCTS CO. LTD.",
  slogan: "Precision Engineering Aligned with Excellent Standards",
  established: "1984",
  establishedPlace: "Hong Kong",
  address: ["Xincheng Industrial District", "HengLi Town, Dongguan City", "GuangDong, China"],
};

export const NAV_LINKS = [
  { href: "#company", id: "company", label: "Company" },
  { href: "#capabilities", id: "capabilities", label: "Capabilities" },
  { href: "#service", id: "service", label: "Service" },
  { href: "#standards", id: "standards", label: "Standards" },
  { href: "#contact", id: "contact", label: "Contact" },
];

/** The four confirmed service categories. Descriptions are deliberately non-technical:
 *  no machine models, tolerances, materials or volumes are claimed. */
export const SERVICES = [
  {
    key: "cnc-machining",
    name: "CNC Machining",
    blurb:
      "Machined components produced from customer drawings and specifications, with scope confirmed per project.",
    image:
      "https://images.unsplash.com/photo-1780034766288-9b436534d428?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    alt: "Machined metal components, a measuring rule and technical drawings on a workbench",
  },
  {
    key: "precision-metal-stamping",
    name: "Precision Metal Stamping",
    blurb:
      "Stamped metal parts manufactured to supplied drawings, with finishing requirements agreed before production.",
    image:
      "https://images.unsplash.com/photo-1770048427702-6b42cdf78b22?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    alt: "Close-up of a formed metal bracket with a precision-finished bore",
  },
  {
    key: "tooling",
    name: "Tooling / CNC Tooling",
    blurb:
      "Tooling prepared to support the manufacture of your parts, reviewed against the drawings you provide.",
    image:
      "https://images.unsplash.com/photo-1676646606766-f8325cac7faf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    alt: "Multi-cavity production tool assembly on a dark background",
  },
  {
    key: "plastic-injection-moulding",
    name: "Plastic Injection Moulding",
    blurb:
      "Moulded plastic components manufactured against approved specifications and agreed production requirements.",
    image: "/photos/injection-moulding.jpg",
    alt: "Injection moulding machine on the Yue Fung production floor",
  },
];

export const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1769147339214-076740872485?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  heroAlt: "Two precision metal components resting on engineering blueprints",
  company: "/photos/injection-moulding.jpg",
  companyAlt: "Injection moulding machine on the Yue Fung production floor",
  capabilities: [
    {
      title: "Manufacturing to Drawing",
      body: "Parts produced against the drawings, dimensions and finishing notes you supply.",
      image:
        "https://images.unsplash.com/photo-1780034766288-9b436534d428?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
      alt: "Machined components with measuring equipment and engineering drawings",
      span: "lg:col-span-8",
      height: "h-[300px] md:h-[420px]",
    },
    {
      title: "Metal & Plastic in One Place",
      body: "Metal and plastic parts handled by the same team, which keeps project communication simple.",
      image:
        "https://images.unsplash.com/photo-1581093803931-46e730e7622e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
      alt: "Industrial production machine in operation",
      span: "lg:col-span-4",
      height: "h-[300px] md:h-[420px]",
    },
    {
      title: "Tooling Support",
      body: "Tooling reviewed and prepared alongside the part it produces.",
      image:
        "https://images.unsplash.com/photo-1676646606766-f8325cac7faf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
      alt: "Production tool assembly ready for installation",
      span: "lg:col-span-4",
      height: "h-[280px] md:h-[360px]",
    },
    {
      title: "Component Finishing",
      body: "Surface and finishing requirements confirmed with you before production begins.",
      image:
        "https://images.unsplash.com/photo-1775726377818-88afc832c078?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
      alt: "Finished threaded metal component on a plain background",
      span: "lg:col-span-4",
      height: "h-[280px] md:h-[360px]",
    },
    {
      title: "Production Capacity",
      body: "Capacity, lead time and volume are confirmed per enquiry — figures are not published until verified.",
      image:
        "https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
      alt: "Production floor with multiple manufacturing machines",
      span: "lg:col-span-4",
      height: "h-[280px] md:h-[360px]",
      placeholder: true,
    },
  ],
};

export const scrollToId = (hash) => {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -104 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};
