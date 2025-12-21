import MainLayout from "@/components/layout/MainLayout";
import CalendarSliderCard from "@/components/layout/rightcontainer/CalendarSliderCard";
import SubscriptionCard from "@/components/layout/rightcontainer/SubscriptionCard";
import { Card } from "@/components/ui/card";
import { useGetUserQuery } from "@/services/api";


export default function RightContainerPage() {
  const { data: user, isLoading } = useGetUserQuery();

  if (isLoading) return null;
  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <Card className="border-none p-0 shadow-none">
          <SubscriptionCard
            isPro={!!user.profile?.is_pro}


            planName="Paket Premium"
            expiredAt={user.profile?.end_date}
          />
        </Card>

        <Card className="border-none p-0 shadow-none">
          <CalendarSliderCard />
        </Card>
      </div>
    </MainLayout>
  );
}
