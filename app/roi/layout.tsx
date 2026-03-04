import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROI Calculator — Covant",
  description:
    "Calculate the ROI of automating your partner program with Covant. See time saved, revenue impact, and cost comparison vs. spreadsheets and legacy PRMs.",
  openGraph: {
    title: "Partner Program ROI Calculator — Covant",
    description:
      "How much is your partner program leaving on the table? Calculate time saved and revenue impact with automated attribution and commissions.",
  },
};

export default function RoiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
