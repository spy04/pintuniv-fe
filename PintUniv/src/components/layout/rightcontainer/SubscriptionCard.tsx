import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { guarantee } from "@/assets/icon";
import { useNavigate } from "react-router-dom";

export default function SubscriptionCard() {
  const navigate = useNavigate();

  return (
    <Card className="rounded-xl border bg-gradient-to-br from-green-200 to-white shadow">
      <CardContent className="p-2">
        <div className="flex items-center gap-3">
          <img src={guarantee} className="w-10" alt="guarantee" />

          <div>
            <h3 className="text-lg font-bold text-green-800">
              Upgrade Premium
            </h3>
            <p className="text-sm text-gray-700">
              Worem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        <Button
          className="mt-4 w-full bg-[#152D64] text-white"
          onClick={() => navigate(`/subscribe`)}
        >
          Upgrade Sekarang
        </Button>
      </CardContent>
    </Card>
  );
}
