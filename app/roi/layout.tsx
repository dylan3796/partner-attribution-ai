import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROI Calculator — Partner Program Savings & Returns | Covant",
  description: "Calculate the ROI of automating your partner program. Estimate time saved, dispute reduction, and net returns based on your program size.",
  openGraph: {
    title: "ROI Calculator — Partner Program Savings & Returns | Covant",
    description: "Calculate the ROI of automating your partner program. Estimate time saved and net returns.",
    url: "https://covant.ai/roi",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
