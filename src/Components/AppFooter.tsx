import { Box, Stack, Typography } from "@mui/material"

export const AppFooter = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Typography variant="h6">
          c2profiler
        </Typography>
        <Typography> - </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component="p"
        >
          Malleable profiles made easy.
        </Typography>
      </Stack>
    </Box>
  )
} //TODO: Add note about local data use only