import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { useGetSimilarVideosQuery } from "src/store/slices/discover";
import { MEDIA_TYPE } from "src/types/Common";
import SimilarVideoCard from "./SimilarVideoCard";
import MaxLineTypography from "./MaxLineTypography";
import NetflixIconButton from "./NetflixIconButton";
import AgeLimitChip from "./AgeLimitChip";
import QualityChip from "./QualityChip";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetailModal() {
  const { detail, setDetailType } = useDetailModal();
  const { data: similarVideos } = useGetSimilarVideosQuery(
    { mediaType: detail.mediaType ?? MEDIA_TYPE.Movie, id: detail.id ?? 0 },
    { skip: !detail.id }
  );

  if (!detail.mediaDetail) return null;
  const show = detail.mediaDetail;

  return (
    <Dialog fullWidth scroll="body" maxWidth="md" open id="detail_dialog" TransitionComponent={Transition}>
      <DialogContent sx={{ p: 0, bgcolor: "#181818" }}>
        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "relative", height: { xs: 280, sm: 420 } }}>
            <Box component="img" src={show.backdrop_path || show.poster_path || ""}
              alt={show.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,#181818 0%,transparent 70%)" }} />
            <IconButton onClick={() => setDetailType({ mediaType: undefined, id: undefined })}
              sx={{ top: 15, right: 15, position: "absolute", bgcolor: "#181818", color: "white" }}>
              <CloseIcon />
            </IconButton>
            <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 20, px: { xs: 2, sm: 5 } }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{show.title}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <NetflixIconButton><AddIcon /></NetflixIconButton>
                {(show.official_site || show.homepage) && (
                  <NetflixIconButton onClick={() => window.open(show.official_site || show.homepage || "#", "_blank")}>
                    <OpenInNewIcon />
                  </NetflixIconButton>
                )}
              </Stack>
            </Box>
          </Box>

          <Container sx={{ py: 2, px: { xs: 2, sm: 5 } }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ color: "success.main" }}>{`${Math.round(show.vote_average * 10)}% Match`}</Typography>
                  <Typography>{(show.release_date || "").substring(0, 4)}</Typography>
                  <AgeLimitChip label="13+" />
                  <QualityChip label="HD" />
                </Stack>
                <MaxLineTypography maxLine={6} variant="body1" sx={{ mt: 2 }}>{show.overview}</MaxLineTypography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ my: 1 }}>Genres: {show.genres.map(g => g.name).join(", ") || "N/A"}</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>Language: {show.language || "N/A"}</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>Network: {show.network || "N/A"}</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>Status: {show.status || "N/A"}</Typography>
              </Grid>
            </Grid>

            {show.episodes.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Episodes</Typography>
                <Stack spacing={1}>
                  {show.episodes.slice(-12).map((episode) => (
                    <Box key={episode.id} sx={{ p: 2, bgcolor: "#242424", borderRadius: 1 }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {episode.image?.medium && <Box component="img" src={episode.image.medium} sx={{ width: 140, height: 80, objectFit: "cover", borderRadius: 1 }} />}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography fontWeight={700}>{`S${episode.season} E${episode.number} — ${episode.name}`}</Typography>
                          <Typography variant="body2" sx={{ opacity: .75 }}>{episode.summary || "Episode details available on TVmaze."}</Typography>
                        </Box>
                        <NetflixIconButton onClick={() => window.open(episode.url, "_blank")}><OpenInNewIcon /></NetflixIconButton>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {similarVideos && similarVideos.results.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>More Like This</Typography>
                <Grid container spacing={2}>
                  {similarVideos.results.map((sm) => (
                    <Grid item xs={6} sm={4} key={sm.id}><SimilarVideoCard video={sm} /></Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Container>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
