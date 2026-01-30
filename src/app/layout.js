import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"], // ใส่ "thai" ด้วยเพื่อรองรับภาษาไทย
  weight: ["400", "700"], // ระบุ weight ที่ต้องการใช้
});

export const metadata = {
  title: "Enterlink",
  description: "รวมลิ้งค์ธุรกิจของคุณในที่เดียว",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} antialiased`}>{children}</body>
    </html>
  );
}
