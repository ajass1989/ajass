'use client';
import './global.css';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
