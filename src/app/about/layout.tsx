import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about StartupOur, our mission, our team, and our commitment to building premium software solutions.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
