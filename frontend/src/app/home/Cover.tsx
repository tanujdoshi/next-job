
"use client";
import {
  Container,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function Cover() {
  const theme = useTheme();
  const captionSize = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  return (
    <Container maxWidth="lg" component={"div"} style={{ marginTop: "17%" }}>
      <Box
        sx={{
          height: "75%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          textAlign: "left",
          alignItems: "left",
          bgcolor: "white",
          fontWeight: "600",
          mt: 3,
          p: 3,
        }}
      >
        <Typography
          variant={captionSize ? "h2" : "h1"}
          component="h1"
          gutterBottom
        >
          <Box>
            Elevate Your Career, <br />
            Boost Your Future
          </Box>
        </Typography>

        <Box mt={4}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#003060 ",
              color: "white",
              padding: "15px 28px",
              borderRadius: "10px",
              "&:hover": {
                bgcolor: "#003060",
              },
            }}
            onClick={() => {
              router.push("/job-listings");
            }}
          >
            Search for Jobs
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
