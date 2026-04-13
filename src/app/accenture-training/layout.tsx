import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accenture Training — GenAI Engineering",
  description:
    "Comprehensive training from zero to Junior+/Middle for the Accenture GenAI Engineering Internship.",
};

export default function AccentureTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
