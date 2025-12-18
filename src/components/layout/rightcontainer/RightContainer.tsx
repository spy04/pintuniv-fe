import SubscriptionCard from "./SubscriptionCard";
import CalendarSliderCard from "./CalendarSliderCard";
import { Card } from "@/components/ui/card";

export default function RightContainer() {
  return (
    <div className="hidden w-[330px] flex-col gap-4 bg-white p-4 md:flex">
      {/* Sub scription */}
      <Card className="border-none p-0 shadow-none">
        <SubscriptionCard />
      </Card>

      {/* Calendar Slider */}
      <Card className="border-none p-0 shadow-none">
        <CalendarSliderCard />
      </Card>
    </div>
  );
}
