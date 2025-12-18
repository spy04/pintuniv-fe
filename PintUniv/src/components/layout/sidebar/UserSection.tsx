import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "@/services/api";

export default function UserSection({ open }) {
  const navigate = useNavigate();
  const { data: user } = useGetUserQuery();

  return (
    <div className="absolute bottom-6 w-full px-3">
      <div
        onClick={() => navigate("/setting")}
        className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-100"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={
              user?.profile?.photo
                ? `${user.profile.photo}?t=${Date.now()}`
                : undefined
            }
            alt={user?.first_name}
          />
          <AvatarFallback>
            {user?.first_name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {open && <span className="font-medium text-[#152D64]">Setting</span>}
      </div>
    </div>
  );
}
