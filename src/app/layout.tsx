import { Metadata } from 'next';

import 'hyuni-style';

export const metadata: Metadata = {
  title: 'Online Simulations - Hyuni Kim',
  authors: {
    name: 'Hyuni Kim',
    url: 'https://www.hyuni.dev',
  },
  description: 'Seb from Hyuni where you can try out various simulations online.',
  keywords: ['Simulation', 'Web', 'Online', 'Physics', 'Maths', 'Programming'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}