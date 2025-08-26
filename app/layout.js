export const metadata = {
  title: 'KlikIndomaret API Viewer',
  description: 'View images and search results from KlikIndomaret API',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
