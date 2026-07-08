import bannerUnstitched from "../assets/images/banner image.png";
import bannerLawn from "../assets/images/banner image2.jpg";
import bannerSilk from "../assets/images/banner image luxury silk.webp";
import bannerNewArrival from "../assets/images/banner image new arrival.webp";

export const banners = [
  {
    id: 1,
    title: "Premium Unstitched Collection",
    subtitle: "New Collection",
    tagline: "Finely woven unstitched premium fabrics to construct your customized fit.",
    image: bannerUnstitched,
    link: "/category/unstitched",
    cta: "Shop Unstitched",
    bgColor: "bg-brand-dark",
    textColor: "text-white",
    taglineColor: "text-brand-sand",
    imagePosition: "object-[center_35%]"
  },
  {
    id: 2,
    title: "The Lawn Edit",
    subtitle: "Summer Lawn",
    tagline: "Pure breathable fabrics designed for supreme elegance and everyday ease.",
    image: bannerLawn,
    link: "/category/lawn-collection",
    cta: "Explore Lawn",
    bgColor: "bg-brand-champagne",
    textColor: "text-brand-dark",
    taglineColor: "text-brand-muted",
    imagePosition: "object-[center_15%]"
  },
  {
    id: 3,
    title: "Luxury Silk Creations",
    subtitle: "Ornate Silk Edits",
    tagline: "Fluid, high-luster raw silk styles featuring intricate cutwork and block prints.",
    image: bannerSilk,
    link: "/category/silk-collection",
    cta: "Shop Silk",
    bgColor: "bg-brand-charcoal",
    textColor: "text-white",
    taglineColor: "text-brand-sand",
    imagePosition: "object-[center_20%]"
  },
  {
    id: 4,
    title: "Latest New Arrivals",
    subtitle: "Curated Edits",
    tagline: "Discover our newest ready-to-wear kurtis and modern digital print ensembles.",
    image: bannerNewArrival,
    link: "/category/new-arrivals",
    cta: "View New In",
    bgColor: "bg-brand-champagne",
    textColor: "text-brand-dark",
    taglineColor: "text-brand-muted",
    imagePosition: "object-[center_25%]"
  }
];
