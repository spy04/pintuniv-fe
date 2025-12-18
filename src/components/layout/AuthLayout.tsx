export default function AuthLayout({
  children,
  sideTitle,
  sideText,
  sideAction,
  showSide = true, // kalau mau hide panel kanan (mobile/full)
}: {
  children: React.ReactNode;
  sideTitle?: string;
  sideText?: string;
  sideAction?: React.ReactNode;
  showSide?: boolean;
}) {
  return (
    <div className="min-h-screen w-screen flex bg-white light">
      {/* LEFT - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>

      {/* RIGHT - optional branding (ke-visibility responsive) */}
      {showSide && (
        <aside className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-700 text-white p-10"
               aria-hidden>
          <div className="max-w-xs text-center">
            <h2 className="text-3xl font-bold mb-3">{sideTitle}</h2>
            <p className="text-sm opacity-90 mb-6">{sideText}</p>
            {sideAction}
          </div>
        </aside>
      )}
    </div>
  );
}
