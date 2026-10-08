export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const COMPANY = {
  name: "Yue Fung Metal Plastic Products Co. Ltd.",
  short: "YUE FUNG",
  sub: "METAL PLASTIC PRODUCTS CO. LTD.",
  slogan: "Precision Engineering Aligned with Excellent Standards",
  established: "1984",
  establishedPlace: "Hong Kong",
  address: ["Xincheng Industrial District", "HengLi Town, Dongguan City", "Guangdong, China"],
};

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#products", label: "Products" },
  { href: "#quality", label: "Quality" },
  { href: "#contact", label: "Contact" },
];

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  about: "https://images.unsplash.com/photo-1700727448686-b314cb5f9948?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  quality: "https://images.unsplash.com/photo-1661921364121-26825beef6e7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  products: {
    metal: "https://images.unsplash.com/photo-1727372416969-6cb1f1696f83?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    plastic: "https://images.unsplash.com/photo-1717386255767-52643970d483?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    industrial: "https://images.unsplash.com/photo-1579126999865-4ecd8fdc00d4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    custom: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
};

export const scrollToId = (hash) => {
  if (window.__lenis) window.__lenis.scrollTo(hash, { offset: -90 });
  else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
};
