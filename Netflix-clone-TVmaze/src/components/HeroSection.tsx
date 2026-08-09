import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlayButton from "./PlayButton";
import MoreInfoButton from "./MoreInfoButton";
import MaturityRate from "./MaturityRate";
import useOffSetTop from "src/hooks/useOffSetTop";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { MEDIA_TYPE } from "src/types/Common";
import { useGetVideosByMediaTypeAndCustomGenreQuery } from "src/store/slices/discover";
import { Movie } from "src/types/Movie";

export default function TopTrailer({ mediaType }: { mediaType: MEDIA_TYPE }) {
  const { data } = useGetVideosByMediaTypeAndCustomGenreQuery({ mediaType, apiString: "popular", page: 1 });
  const [show, setShow] = useState<Movie | null>(null);
  const isOffset = useOffSetTop(window.innerWidth * 0.5625);
  const { setDetailType } = useDetailModal();

  useEffect(() => {
    if (data?.results?.length) {
      const candidates = data.results.filter((item) => !!item.backdrop_path);
      setShow(candidates[Math.floor(Math.random() * candidates.length)] || candidates[0] || null);
    }
  }, [data]);

  if (!show || isOffset) return show ? <Box sx={{ height: 1 }} /> : null;

  return (
    <Box sx={{ position: "relative", zIndex: 1, mb: 3 }}>
      <Box sx={{ width: "100%", height: "56.25vw", maxHeight: 720, position: "relative", overflow: "hidden" }}>
        <Box component="img" src={show.backdrop_path || show.poster_path || ""} alt={show.title}
          sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.85), transparent 70%)" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,#141414,transparent 55%)" }} />
        <Stack spacing={3} sx={{ position: "absolute", left: { xs: "4%", md: 60 }, bottom: "18%", width: { xs: "75%", md: "38%" } }}>
          <Typography variant="h2" sx={{ fontWeight: 800 }}>{show.title}</Typography>
          <Typography variant="h6" sx={{ display: { xs: "none", md: "block" } }}>{show.overview}</Typography>
          <Stack direction="row" spacing={2}>
            <PlayButton size="large" onClick={() => window.open(show.official_site || show.homepage || "#", "_blank")} />
            <MoreInfoButton size="large" onClick={() => setDetailType({ mediaType, id: show.id })} />
          </Stack>
        </Stack>
        <Box sx={{ position: "absolute", right: 0, bottom: "22%" }}><MaturityRate>13+</MaturityRate></Box>
      </Box>
    </Box>
  );
}
