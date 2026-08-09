import { useEffect, useRef, useState } from "react";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import VideoItemWithHoverPure from "./VideoItemWithHoverPure";

interface VideoItemWithHoverProps { video: Movie; }

export default function VideoItemWithHover({ video }: VideoItemWithHoverProps) {
  const setPortal = usePortal();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) setPortal(elementRef.current, video);
    else setPortal(null, null);
  }, [isHovered, setPortal, video]);

  return (
    <VideoItemWithHoverPure
      ref={elementRef}
      handleHover={setIsHovered}
      src={video.backdrop_path || video.poster_path || ""}
    />
  );
}
