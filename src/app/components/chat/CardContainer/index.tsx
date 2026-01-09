"use client";

import ContactMailIcon from "@mui/icons-material/ContactMail";
import FaceIcon from "@mui/icons-material/Face";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { JSX } from "react";

type CardContainer = {
  shrink: boolean;
};

const suggestions = ["Me", "Projects", "Skills", "Contact"] as const;
type SuggestionKey = (typeof suggestions)[number];

const suggestionIcons: Record<SuggestionKey, JSX.Element> = {
  Me: <FaceIcon fontSize="large" sx={{ color: "#00bcd4" }} />,
  Projects: <LightbulbIcon fontSize="large" sx={{ color: "#7c4dff" }} />,
  Skills: <LocalLibraryIcon fontSize="large" sx={{ color: "#26c6da" }} />,
  Contact: <ContactMailIcon fontSize="large" sx={{ color: "#64b5f6" }} />,
};

export default function CardContainer({ shrink }: CardContainer) {
  const router = useRouter();
  function clickHandler(text: string) {
    let query = "";
    switch (text.toLowerCase()) {
      case "projects":
        query = "What are your projects? What are you working on right now?";
        break;
      case "skills":
        query =
          "What are your skills? Give me a list of your soft and hard skills.";
        break;
      case "contact":
        query = "How can I contact you?";
        break;
      default:
        query = "Who are you? I want to know more about you.";
        break;
    }

    const encodedQuery = encodeURIComponent(query);
    router.push(`/chat?content=${encodedQuery}`);
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 1,
        justifyContent: "center",
      }}
    >
      {suggestions.map((text, i) => (
        <Card
          key={i}
          variant="outlined"
          sx={{
            minWidth: 150,
            cursor: "pointer",
            flexShrink: 0,
            borderRadius: "16px",
            "&:hover": {
              boxShadow: 4,
            },
          }}
          onClick={() => clickHandler(text)}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: shrink ? "row" : "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              {suggestionIcons[text]}
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                title={text}
                textAlign="center"
              >
                {text}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
