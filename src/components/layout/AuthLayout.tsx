export default function AuthLayout({
  children,
  sideTitle,
  sideText,
  sideAction,
  showSide = true,
}: {
  children: React.ReactNode;
  sideTitle?: string;
  sideText?: string;
  sideAction?: React.ReactNode;
  showSide?: boolean;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-screen">
      {/* LEFT — form */}
      <div className="flex flex-1 items-center justify-center p-6">
        {children}
      </div>

      {/* RIGHT — branding panel */}
      {showSide && (
        <aside
          className="bg-primary text-primary-foreground hidden flex-1 items-center justify-center p-10 md:flex"
          aria-hidden="true"
        >
          <div className="max-w-xs text-center">
            {sideTitle && (
              <h2 className="mb-3 text-3xl font-bold">{sideTitle}</h2>
            )}
            {sideText && <p className="mb-6 text-sm opacity-90">{sideText}</p>}
            {sideAction}
          </div>
        </aside>
      )}
    </div>
  );
}
