import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import "@/styles/globals.css";
import { Toaster } from "sonner";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Component {...pageProps} />
      <Toaster richColors />
    </div>
  );
};

export default MyApp;
