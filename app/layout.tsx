import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Est-ce que l\'UAT est freeze?',
  description: 'Vérifier le statut de freeze de l\'UAT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
