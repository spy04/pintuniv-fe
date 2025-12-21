import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { guarantee } from "@/assets/icon";
import { useNavigate } from "react-router-dom";

type Props = {
  isPro: boolean;
  planName?: string;
  expiredAt?: string;
};

export default function SubscriptionCard({
  isPro,
  planName,
  expiredAt,
}: Props) {
  const navigate = useNavigate();

  const remainingTime =
    isPro && expiredAt ? getRemainingDays(expiredAt) : null;

  return (
    <Card className="rounded-xl border bg-gradient-to-br from-green-200 to-white shadow">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <img src={guarantee} className="w-10" alt="guarantee" />

          <div className="flex-1">
            {/* TITLE */}
            <h3 className="text-lg font-bold text-green-800">
              {isPro ? planName : "Buka Fitur Premium!"}
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-1 text-xs text-gray-700">
              {isPro
                ? `Masa aktif tersisa: ${remainingTime}`
                : "Dapatkan akses penuh ke informasi jalur masuk universitas, materi lengkap, ribuan soal latihan, serta tryout dengan sistem ranking."}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button
          className="mt-4 w-full bg-[#152D64] text-white"
          onClick={() =>
            navigate(isPro ? "/subscribe" : "/subscribe")
          }
        >
          {isPro ? "Upgrade Plan" : "Pintu Universitas"}
        </Button>
      </CardContent>
    </Card>
  );
}

function getRemainingDays(expiredAt: string) {
  const now = new Date();
  const end = new Date(expiredAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Masa aktif habis";

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days} hari lagi`;
}
