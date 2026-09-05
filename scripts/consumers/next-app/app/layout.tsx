import type { ReactNode } from "react";
import "@chumlab/ui/styles.css";

export const metadata = { title: "chumlab consumer" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
