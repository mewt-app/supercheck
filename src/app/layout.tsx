import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const superFont = Poppins({
  weight: ['200', '500', '700'],
  subsets: ['latin'],
  style: 'normal'
});

export const metadata: Metadata = {
  title: 'Super Checkout ✨',
  description: `Supercharge your checkout with SuperCheckout by SuperPe
  SuperCheckout, by the trusted fintech platform SuperPe.in, delivers a frictionless checkout experience designed to skyrocket your conversion rates.  Just like Bolt, Paddle, and Link.com, SuperCheckout prioritizes:
  
  Instant Activation & Onboarding: Get started selling immediately without lengthy setup processes.
  Seamless User Experience: Offer your customers a smooth and effortless checkout, reducing cart abandonment.
  SuperCheckout empowers businesses to:
  
  Increase Sales: Convert more website visitors into paying customers with a user-friendly checkout flow.
  Reduce Costs: Eliminate the need for complex integrations and streamline your sales process.
  Focus on Growth: Spend less time on checkout management and dedicate more resources to growing your business.
  SuperCheckout: The checkout solution built for success.`
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={superFont.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
