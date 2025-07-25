import { Noto_Sans_KR, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import WelcomeModal from "../components/WelcomeModal";
import RandomQuestionModal from "../components/RandomQuestionModal";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "WriteMe - 나다운 글, 나답게 쓰다",
  description: "AI가 도와주는 개성있는 이력서와 자기소개서 작성 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${inter.variable} antialiased font-noto-sans-kr`}
      >
        <AuthProvider>
          {children}
          <WelcomeModal />
          <RandomQuestionModal />
        </AuthProvider>
      </body>
    </html>
  );
}
