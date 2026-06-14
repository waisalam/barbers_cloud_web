// Admin pages inherit root layout (fonts + ThemeProvider) but skip marketing nav/footer
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
}
