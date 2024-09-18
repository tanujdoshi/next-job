
"use client"

import PropTypes from 'prop-types';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export default function OverviewTile(props:any) {
  const { sx = { height: "100%", cursor: 'pointer' }, value, active, onClick, title } = props;
  const activeStyle = active ? { backgroundColor: 'lightgray' } : {};
  return (
    <Card sx={{...sx, ...activeStyle}} onClick={onClick}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <AutoGraphIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTile.propTypes = {
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired
};

