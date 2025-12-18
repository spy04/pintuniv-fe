import { Card, CardContent } from "@/components/ui/card";
import { logo_snbt } from "@/assets/icon";

export default function SliderContent({ slide }: any) {
  if (!slide) return null;

  return (
    <div className="w-full flex flex-col items-center">

      {/* QUOTE */}
      {slide.type === "quote" && (
        <Card className="w-full bg-[#0A2A7A] text-white rounded-2xl">
          <CardContent className="p-6 text-center">
            <p className="text-lg">{slide.text}</p>
            <p className="text-sm mt-3 opacity-80">~ {slide.author} ~</p>
          </CardContent>
        </Card>
      )}

      {/* PROMO */}
      {slide.type === "promo" && (
        <Card className="w-full rounded-xl overflow-hidden">
          <img
            src={slide.img}
            className="w-full h-40 object-cover"
            alt="promo"
          />
        </Card>
      )}

      {/* COUNTDOWN */}
      {slide.type === "countdown" && (
        <Card className="w-full">
          <CardContent className="p-4">
            <img
              src={logo_snbt}
              className="w-14 mx-auto mb-2"
              alt="logo snbt"
            />

            <div className="flex w-full rounded-xl overflow-hidden">
              <div className="flex-1 p-2 text-center border-r">
                <p className="text-sm text-gray-500">Sisa Hari</p>
                <p className="text-3xl font-bold text-[#1D2B53]">{slide.days}</p>
              </div>

              <div className="flex-1 p-4 text-center">
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="text-[#1D2B53] font-bold">
                  {new Date(slide.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
