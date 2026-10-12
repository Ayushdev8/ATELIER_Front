import './globals.css';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import NotificationContainer from '@/components/ui/Notification';
import StoreLayoutWrapper from '@/components/layout/StoreLayoutWrapper';

export const metadata = {
  title: 'ATELIER & CO. | Contemporary Luxury E-Commerce',
  description: 'A complete, modern, and responsive e-commerce experience crafted with Next.js App Router and Tailwind CSS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FAF8F5] text-stone-900 min-h-screen selection:bg-brand-200 selection:text-brand-900 antialiased">
        <NotificationProvider>
          <AuthProvider>
            <StoreProvider>
              <CartProvider>
                <WishlistProvider>
                  <NotificationContainer />
                  <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
                </WishlistProvider>
              </CartProvider>
            </StoreProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
