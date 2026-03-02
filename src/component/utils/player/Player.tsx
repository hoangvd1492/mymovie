"use client";

import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { Lightbulb } from "lucide-react";
import { renderToString } from "react-dom/server";

interface Props {
  url: string;
}

export default function Player({ url }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<Artplayer | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [lightOn, setLightOn] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    const art = new Artplayer({
      container: containerRef.current,
      url,
      fullscreen: true,
      setting: true,
      playbackRate: true,
      aspectRatio: true,
      controls: [
        {
          name: "light",
          position: "right",
          html: (() => {
            const div = document.createElement("div");
            div.innerHTML = renderToString(<Lightbulb size={20} />);
            return div;
          })(),
          tooltip: "Tắt đèn",
          click: () => setLightOn((prev) => !prev),
        },
      ],
      customType: {
        m3u8: function (video: HTMLVideoElement, url: string) {
          if (Hls.isSupported()) {
            hlsRef.current?.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hlsRef.current = hls;
            art.on("destroy", () => hls.destroy());
          } else {
            video.src = url;
          }
        },
      },
    });

    artRef.current = art;

    return () => {
      hlsRef.current?.destroy();
      artRef.current?.destroy(true);
    };
  }, [url]);

  useEffect(() => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [url]);

  return (
    <div className="flex gap-2 md:h-[85vh] h-[256px]">
      <div className={`relative z-50 bg-black flex-1`}>
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {!lightOn && (
        <div className="fixed inset-0 bg-black/95 pointer-events-none z-40" />
      )}
    </div>
  );
}
