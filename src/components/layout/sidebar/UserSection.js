import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "@/services/api";
export default function UserSection({ open }) {
    const navigate = useNavigate();
    const { data: user } = useGetUserQuery();
    return (_jsx("div", { className: "absolute bottom-6 w-full px-3", children: _jsxs("div", { onClick: () => navigate("/setting"), className: "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-100", children: [_jsxs(Avatar, { className: "h-10 w-10", children: [_jsx(AvatarImage, { src: user?.profile?.photo
                                ? `${user.profile.photo}?t=${Date.now()}`
                                : undefined, alt: user?.first_name }), _jsx(AvatarFallback, { children: user?.first_name?.[0]?.toUpperCase() || "U" })] }), open && _jsx("span", { className: "font-medium text-[#152D64]", children: "Setting" })] }) }));
}
