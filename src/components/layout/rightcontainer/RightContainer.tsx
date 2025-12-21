import SubscriptionCard from "./SubscriptionCard";
import CalendarSliderCard from "./CalendarSliderCard";
import { Card } from "@/components/ui/card";
import { useGetUserQuery } from "@/services/api";

export default function RightContainer() {
  const { data: user, isLoading } = useGetUserQuery();

  if (isLoading) return null;

  return (
    <div className="hidden w-[330px] flex-col gap-4 bg-white p-4 md:flex">
      {/* Subscription */}
      <Card className="border-none p-0 shadow-none">
        <SubscriptionCard
          isPro={!!user.profile?.is_pro}
          
          
          planName="Paket Premium"
          expiredAt={user.profile?.end_date}
        />
      </Card>

      {/* Calendar Slider */}
      <Card className="border-none p-0 shadow-none">
        <CalendarSliderCard />
      </Card>
    </div>
  );
}
