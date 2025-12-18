import { Link } from "react-router-dom";
import clsx from "clsx";

export default function SidebarItem({ label, icon: Icon, href, active, open }) {
  return (
    <Link
      to={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-semibold no-underline",

        active
          ? "bg-[#152D64] !text-white"
          : "!text-gray-500 hover:bg-gray-100"
      )}
    >
      <Icon size={20} />
      {open && <span className="text-lg">{label}</span>}
    </Link>
  );
}
