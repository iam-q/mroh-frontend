import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import "../styles/global.css";
import MainLayout from "./components/layout/MainLayout";
import ThemeProviderClient from "./components/ThemeProviderClient";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} h-full leading-normal`}
        style={{ margin: "0", minHeight: "100vh" }}
      >
        <AppRouterCacheProvider>
          <ThemeProviderClient>
            <MainLayout>{children}</MainLayout>
          </ThemeProviderClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
