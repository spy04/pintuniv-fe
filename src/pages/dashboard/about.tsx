import { Mail, Phone, Copy, ExternalLink, Check, X } from "lucide-react";
import { useState } from "react";

export default function About() {
  const email = "support@pintuniv.com";
  const whatsapp = "+6287881877917";

  const whatsappHref = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;

  const [copied, setCopied] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div>
      {/* ================= COMPANY DESCRIPTION ================= */}
      <h2 className="pt-5 text-2xl font-bold">Company Description</h2>

      <p className="pt-3">
        Pintu Universitas adalah platform pembelajaran dan tryout daring yang
        membantu siswa SMA/SMK mempersiapkan masuk perguruan tinggi. Kami
        menyediakan modul interaktif, soal tryout berkualitas, dan analisis
        hasil yang memudahkan siswa mengasah kesiapan ujian.
      </p>

      {/* ================= CONTACT US ================= */}
      <h2 className="pt-5 text-2xl font-bold">Contact Us</h2>

      <div className="mt-4 space-y-3">

        {/* =============== EMAIL ROW =============== */}
        <div
          onClick={() => setOpenPopup(true)}
          className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Mail size={18} />
            <span className="text-sm">{email}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // supaya nggak buka popup email
              copyToClipboard(email);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-gray-200 transition"
          >
            {copied === email ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* =============== WHATSAPP ROW =============== */}
        <div
          onClick={() => window.open(whatsappHref, "_blank")}
          className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Phone size={18} />
            <span className="text-sm">{whatsapp}</span>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-gray-200 transition"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* ================= NOTIFICATION ================= */}
      {copied && (
        <p className="text-green-600 text-sm pt-3">
          {copied.includes("@") ? "Email disalin!" : "Nomor WhatsApp disalin!"}
        </p>
      )}

      {/* ================= POPUP EMAIL ================= */}
      {openPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-80 shadow-lg relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setOpenPopup(false)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4">Buka dengan:</h3>

            <div className="space-y-3">

              {/* Default Email App */}
              <a
                href={`mailto:${email}`}
                className="block p-2 border rounded hover:bg-gray-100 cursor-pointer"
              >
                Default Mail App
              </a>

              {/* Gmail */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 border rounded hover:bg-gray-100 cursor-pointer"
              >
                Gmail
              </a>

              {/* Outlook */}
              <a
                href={`https://outlook.live.com/mail/deeplink/compose?to=${email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 border rounded hover:bg-gray-100 cursor-pointer"
              >
                Outlook Web
              </a>

              {/* Yahoo */}
              <a
                href={`https://compose.mail.yahoo.com/?to=${email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 border rounded hover:bg-gray-100 cursor-pointer"
              >
                Yahoo Mail
              </a>

              {/* Copy Button */}
              <button
                onClick={() => {
                  copyToClipboard(email);
                  setOpenPopup(false);
                }}
                className="block w-full p-2 border rounded hover:bg-gray-100 cursor-pointer text-left"
              >
                Copy Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
