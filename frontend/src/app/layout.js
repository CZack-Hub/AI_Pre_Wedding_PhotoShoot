import "./globals.css";

export const metadata = {
  title: "ITVoice AI Pre-Wedding Studio - Hyper-Realistic Dressing & Backdrops Swapper",
  description: "Revolutionizing wedding photography by generating hyper-realistic, cinematic pre-wedding photos and video reels using generative AI. Powered by FastAPI, NextJS, Supabase, and Cloudflare R2.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
