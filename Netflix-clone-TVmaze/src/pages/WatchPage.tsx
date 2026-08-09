import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLazyGetAppendedVideosQuery } from "src/store/slices/discover";
import { MEDIA_TYPE } from "src/types/Common";
import MainLoadingScreen from "src/components/MainLoadingScreen";

export function Component() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const showId = Number(params.get("show"));
  const [getShow, { data, isLoading }] = useLazyGetAppendedVideosQuery();

  useEffect(() => {
    if (showId) getShow({ mediaType: MEDIA_TYPE.Movie, id: showId });
  }, [showId, getShow]);

  if (isLoading) return <MainLoadingScreen />;
  if (!data) {
    return (
      <Container sx={{ pt: 15 }}>
        <Typography variant="h5">Select a TV show to view its episodes.</Typography>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate("/browse")}>Back to Browse</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", pt: 10, pb: 5, bgcolor: "#141414" }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/browse")} sx={{ mb: 3 }}>Back</Button>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <Box component="img" src={data.image?.original || data.poster_path || ""} alt={data.title}
            sx={{ width: { xs: "100%", md: 360 }, maxHeight: 520, objectFit: "cover", borderRadius: 1 }} />
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>{data.title}</Typography>
            <Typography sx={{ mt: 2, color: "success.main" }}>{data.network || "TVmaze"} • {data.language}</Typography>
            <Typography sx={{ mt: 2 }}>{data.overview}</Typography>
            {(data.official_site || data.homepage) && (
              <Button variant="contained" sx={{ mt: 3 }} endIcon={<OpenInNewIcon />}
                onClick={() => window.open(data.official_site || data.homepage || "#", "_blank")}>
                Open Official Show Page
              </Button>
            )}
          </Box>
        </Stack>

        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>Episodes</Typography>
        <Stack spacing={2}>
          {data.episodes.map((episode) => (
            <Box key={episode.id} sx={{ display: "flex", gap: 2, p: 2, bgcolor: "#222", borderRadius: 1 }}>
              {episode.image?.medium && <Box component="img" src={episode.image.medium} sx={{ width: 160, height: 90, objectFit: "cover" }} />}
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={700}>{`S${episode.season} E${episode.number} — ${episode.name}`}</Typography>
                <Typography variant="body2" sx={{ opacity: .75 }}>{episode.summary || "No episode summary available."}</Typography>
                <Typography variant="caption">{episode.airdate} {episode.airtime}</Typography>
              </Box>
              <Button onClick={() => window.open(episode.url, "_blank")} endIcon={<OpenInNewIcon />}>TVmaze</Button>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

Component.displayName = "WatchPage";
