import Image from "next/image";
import Link from "next/link";

import logo from "../../../public/codly-logo.png";

export function Logo() {
  return (
    <Link
      href="/dashboard"
      aria-label="Codly home"
      className="flex items-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Image src={logo} alt="Codly" preload className="h-8 w-auto" />
    </Link>
  );
}
