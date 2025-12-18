// src/utils/buildUserPayload.ts
export function buildUserPayload(user, override = {}) {
    return {
        username: user.username,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        profile: {
            photo: user.profile?.photo ?? null,
            gender: user.profile?.gender ?? null,
            bio: user.profile?.bio ?? "",
            asal_sekolah: user.profile?.asal_sekolah ?? null,
            Jurusan: user.profile?.Jurusan ?? null,
            tahun_lulus: user.profile?.tahun_lulus ?? null,
            ...(override.profile || {}),
        },
        ...override,
    };
}
