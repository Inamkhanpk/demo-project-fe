import './globals.css';

export const metadata = {
  title: 'Business Performance Dashboard',
  description: 'Demo dashboard for recruiter submission'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}