// components/common/LoadingGif.tsx
import Image from "next/image";

export const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/loading.gif"
          alt="Loading..."
          width={120}
          height={120}
          unoptimized
        />
      </div>
    </div>
  );
};
