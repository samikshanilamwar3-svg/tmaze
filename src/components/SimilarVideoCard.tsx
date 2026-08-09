import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { Movie } from "src/types/Movie";
import NetflixIconButton from "./NetflixIconButton";
import MaxLineTypography from "./MaxLineTypography";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import AgeLimitChip from "./AgeLimitChip";

export default function SimilarVideoCard({ video }: { video: Movie }) {
  return (
    <Card>
      <div style={{ width: "100%", position: "relative", paddingTop: "calc(9 / 16 * 100%)" }}>
        <img
          src={video.backdrop_path || video.poster_path || ""}
          alt={video.title}
          style={{ top: 0, width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
        />
        <div style={{ top: 10, right: 15, position: "absolute" }}>
          <Typography variant="subtitle2">
            {formatMinuteToReadable(video.runtime || getRandomNumber(60))}
          </Typography>
        </div>
        <div style={{ left: 0, right: 0, bottom: 0, padding: "0 16px 4px", position: "absolute" }}>
          <MaxLineTypography maxLine={1} sx={{ width: "80%", fontWeight: 700 }} variant="subtitle1">
            {video.title}
          </MaxLineTypography>
        </div>
      </div>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center">
            <div>
              <Typography variant="subtitle2" sx={{ color: "success.main" }}>
                {`${Math.round(video.vote_average * 10)}% Match`}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <AgeLimitChip label="13+" />
                <Typography variant="body2">{(video.release_date || "").substring(0, 4)}</Typography>
              </Stack>
            </div>
            <div style={{ flexGrow: 1 }} />
            <NetflixIconButton><AddIcon /></NetflixIconButton>
          </Stack>
          <MaxLineTypography maxLine={4} variant="subtitle2">{video.overview}</MaxLineTypography>
        </Stack>
      </CardContent>
    </Card>
  );
}
