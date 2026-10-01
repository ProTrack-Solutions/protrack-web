import type { Metadata } from "next";
import { DemoEntry } from "./components/DemoEntry";

export const metadata: Metadata = {
  title: "Demonstração",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return <DemoEntry />;
}
