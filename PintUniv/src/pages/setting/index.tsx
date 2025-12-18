import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useGetUserQuery, useUpdateUserMutation } from "@/services/api";

import { buildUserPayload } from "@/utils/buildUserPayload";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { api } from "@/services/api";
/* ================= PAGE ================= */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();

  const [form, setForm] = useState<any>(null);

  const dispatch = useAppDispatch();

  /* ===== INIT LOCAL FORM ===== */
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        bio: user.profile?.bio || "",
        asal_sekolah: user.profile?.asal_sekolah || "",
        Jurusan: user.profile?.Jurusan || "",
        tahun_lulus: user.profile?.tahun_lulus || "",
        gender: user.profile?.gender || "",
      });
    }
  }, [user]);

  /* ================= HANDLERS ================= */

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBlur = async (field: string, isProfile = false) => {
    if (!user || !form) return;

    const payload = buildUserPayload(user, {
      ...(isProfile
        ? { profile: { [field]: form[field] } }
        : { [field]: form[field] }),
    });

    await updateUser(payload);
  };

  const handleGenderChange = async (value: string) => {
    if (!user) return;

    setForm((prev: any) => ({
      ...prev,
      gender: value,
    }));

    const payload = buildUserPayload(user, {
      profile: { gender: value },
    });

    await updateUser(payload);
  };

  const handlePhotoChange = async (file: File) => {
    if (!user) return;

    const base = buildUserPayload(user);
    const formData = new FormData();

    // root fields
    formData.append("username", base.username);
    formData.append("first_name", base.first_name);
    formData.append("last_name", base.last_name);
    formData.append("email", base.email);
    formData.append("phone_number", base.phone_number);

    // profile fields (kecuali photo)
    Object.entries(base.profile).forEach(([key, val]) => {
      if (key !== "photo") {
        formData.append(`profile.${key}`, String(val ?? ""));
      }
    });

    // photo file
    formData.append("profile.photo", file);

    // 🔥 CALL API
    const res = await updateUser(formData as any).unwrap();

    /**
     * res biasanya berisi user terbaru
     * contoh: res.profile.photo = "https://..."
     */
    if (res?.profile?.photo) {
      // 1️⃣ update localStorage
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          photo: res.profile.photo,
        },
      };
      if (res?.profile?.photo) {
        dispatch(
          api.util.updateQueryData("getUser", undefined, (draft: any) => {
            draft.profile.photo = res.profile.photo;
          }),
        );
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ================= STATES ================= */
  if (isLoading || !form)
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  /* ================= RENDER ================= */
  return (
    <MainLayout showRightContainer={false}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        {/* ================= SIDEBAR ================= */}
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="size-24">
              <AvatarImage src={user?.profile?.photo} />
              <AvatarFallback>{user?.first_name?.[0] || "U"}</AvatarFallback>
            </Avatar>

            <label className="text-primary cursor-pointer text-sm underline">
              Ganti Foto
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handlePhotoChange(e.target.files[0])
                }
              />
            </label>

            <h3 className="font-semibold">
              {user.first_name} {user.last_name}
            </h3>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* ================= CONTENT ================= */}
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>

            {/* GENDER */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.gender === "Male"}
                  onChange={() => handleGenderChange("Male")}
                />
                Male
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.gender === "Female"}
                  onChange={() => handleGenderChange("Female")}
                />
                Female
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                onBlur={() => handleBlur("first_name")}
                placeholder="First Name"
              />

              <Input
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                onBlur={() => handleBlur("last_name")}
                placeholder="Last Name"
              />
            </div>

            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="Email"
            />

            <Input
              value={form.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              onBlur={() => handleBlur("phone_number")}
              placeholder="Phone Number"
            />

            <Textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              onBlur={() => handleBlur("bio", true)}
              placeholder="Bio"
            />

            <Input
              value={form.asal_sekolah}
              onChange={(e) => handleChange("asal_sekolah", e.target.value)}
              onBlur={() => handleBlur("asal_sekolah", true)}
              placeholder="Asal Sekolah"
            />

            <Input
              value={form.Jurusan}
              onChange={(e) => handleChange("Jurusan", e.target.value)}
              onBlur={() => handleBlur("Jurusan", true)}
              placeholder="Jurusan"
            />

            <Input
              type="number"
              value={form.tahun_lulus}
              onChange={(e) => handleChange("tahun_lulus", e.target.value)}
              onBlur={() => handleBlur("tahun_lulus", true)}
              placeholder="Tahun Lulus"
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
