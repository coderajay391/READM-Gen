import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Markdown Generator App',
  description:
    'Modern Bento-grid workspace to compose, format, preview, and export high-fidelity Markdown files with live preview, starter templates, and analytics.',
  openGraph: {
    title: 'Markdown Generator App',
    description:
      'Modern Bento-grid workspace to compose, format, preview, and export high-fidelity Markdown files with live preview, starter templates, and analytics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markdown Generator App',
    description:
      'Modern Bento-grid workspace to compose, format, preview, and export high-fidelity Markdown files with live preview, starter templates, and analytics.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('markdown-studio-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-neutral-900 transition-colors duration-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
