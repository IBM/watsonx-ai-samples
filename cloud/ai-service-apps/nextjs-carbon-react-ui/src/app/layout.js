import { Providers } from "./providers";
import { THEME, COOKIE_KEYS } from "../utils/constants";
import { cookies } from "next/headers";
import "./globals.scss";

export const metadata = {
  title: "AI Service app",
  description: "IBM watsonx.ai app with Next.js 15",
};

async function getTheme() {
  const cookiesStorage = await cookies();
  return cookiesStorage.get(COOKIE_KEYS.THEME)?.value || THEME.SYSTEM;
}

export default async function RootLayout({ children }) {
  const theme = await getTheme();

  return (
    <html lang="en">
      <body data-theme={theme || THEME.SYSTEM}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
