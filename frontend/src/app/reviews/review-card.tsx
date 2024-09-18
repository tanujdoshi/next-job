import * as React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

export default function RecipeReviewCard(props: any) {
  const { title, subheader } = props;
  const avatarLetter = title.charAt(0);
  const [color, setColor] = React.useState(getRandomColor());

  return (
    <Card
      sx={{
        maxWidth: 345,
        marginLeft: 2,
        marginRight: 2,
        boxShadow: 0,
      }}
    >
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: color }}>{avatarLetter}</Avatar>}
        title={title}
        subheader={subheader}
      />
    </Card>
  );
}
