// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Tus estilos globales
import { Navbar } from '../../components/Navbar';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Farmacia App',
  description: 'Gestión de Farmacia con Next.js y Prisma',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar /> {/* Coloca el Navbar aquí */}
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}