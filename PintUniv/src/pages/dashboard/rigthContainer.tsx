import MainLayout from "@/components/layout/MainLayout";
import CalendarSliderCard from "@/components/layout/rightcontainer/CalendarSliderCard";
import SubscriptionCard from "@/components/layout/rightcontainer/SubscriptionCard";
import { Card } from "@/components/ui/card";

export default function RightContainerPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <Card className="border-none p-0 shadow-none">
          <SubscriptionCard />
        </Card>

        <Card className="border-none p-0 shadow-none">
          <CalendarSliderCard />
        </Card>
      </div>
    </MainLayout>
  );
}
