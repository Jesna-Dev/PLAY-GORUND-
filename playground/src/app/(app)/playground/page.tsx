import type { Metadata } from "next";
import { PlaygroundLoader } from "@/components/playground/playground-loader";

export const metadata: Metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return <PlaygroundLoader />;
}
