import { Box, Stack, Typography } from "@mui/material"

export const AppFooter = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Typography variant="h6">
          <span style={{ color: "#f44336" }}>c2</span>profiler
        </Typography>
        <Typography> - </Typography>
        <Stack direction="column">
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="p"
          >
            Editing malleable profiles in your browser only.
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            textAlign="center"
            component="p">
            No data is uploaded to any servers.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}