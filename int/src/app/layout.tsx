// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Intranet',
  description: 'Intranet z logowaniem (Directus + Next.js)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}