import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work & Case Studies",
  description: "Explore our complete portfolio of digital products, enterprise systems, and high-performance mobile applications.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
