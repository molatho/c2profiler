import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Dialog, Grid, List, ListItem, ListItemAvatar, Stack, Typography } from "@mui/material";
import { LogoSmall } from "../Components/Misc/LogoSmall";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { IconButton } from "@mui/material";
import { grey } from '@mui/material/colors';

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

export const About = ({ open, onClose }: SimpleDialogProps) => {
    return <Dialog onClose={onClose} open={open}>
        <Card sx={{ maxWidth: 400, overflow: "scroll" }}>
            <CardMedia
                component="div"
            ><LogoSmall /></CardMedia>
            <CardContent>
                {/* About */}
                <Typography gutterBottom variant="h5">
                    About
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                    Creating, editing and testing malleable profiles can be quite the tedious task to do. Out of this inconvenience c2profiler was born, with a clear determination to make working with malleable profiles easier.
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" sx={{ mb: "1em" }}>
                    c2profiler is a progressive web app (PWA) and handles your profiles <b>locally in your browser, without sending any data to any servers</b>. It's written in TypeScript and runs atop of ReactJS. If you'd like to improve it, please feel free to do so and create a pull-request:
                </Typography>
                <a href="https://github.com/molatho/c2profiler" target="_blank">
                    <Button variant="contained" startIcon={<GitHubIcon />} size="small" sx={{ textTransform: "none", mb: "2em", width: "100%" }}>
                        github.com/molatho/c2profiler
                    </Button>
                </a>
                {/* Credits */}
                <Typography gutterBottom variant="h5">
                    Credits
                </Typography>
                <List sx={{ width: '100%', p: 0, m: 0, mb: "2em" }}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src="https://avatars.githubusercontent.com/u/43727386" />
                        </ListItemAvatar>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Moritz Thomas</Typography>
                                <Typography color={grey[500]}>Idea & implementation</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <a href="https://github.com/molatho" target="_blank">
                                        <IconButton size="small">
                                            <GitHubIcon />
                                        </IconButton>
                                    </a>
                                    <a href="https://www.linkedin.com/in/moritz-thomas-34992718a/" target="_blank">
                                        <IconButton size="small">
                                            <LinkedInIcon />
                                        </IconButton>
                                    </a>
                                </Stack>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
                {/* Thanks */}
                <Typography gutterBottom variant="h5">
                    Special Thanks
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" sx={{ mb: "2em" }}>
                    Credit where credit is due: the following people supported the development of c2profiler either directly or indirectly.
                </Typography>
                <List sx={{ width: '100%', p: 0, m: 0 }}>
                    {/* Adrian */}
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src="https://avatars.githubusercontent.com/u/29756854" />
                        </ListItemAvatar>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Adrian Gast</Typography>
                                <Typography color={grey[500]}>UI/UX support</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <a href="https://github.com/itsEzz" target="_blank">
                                        <IconButton size="small">
                                            <GitHubIcon />
                                        </IconButton>
                                    </a>
                                    <a href="https://www.linkedin.com/in/adrian-g-852669182/" target="_blank">
                                        <IconButton size="small">
                                            <LinkedInIcon />
                                        </IconButton>
                                    </a>
                                </Stack>
                            </Grid>
                        </Grid>
                    </ListItem>
                    {/* Patrick */}
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src="https://avatars.githubusercontent.com/u/14962702" />
                        </ListItemAvatar>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Patrick Eisenschmidt</Typography>
                                <Typography color={grey[500]}>Guidance & feedback</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <a href="https://github.com/Patrick-DE" target="_blank">
                                        <IconButton size="small">
                                            <GitHubIcon />
                                        </IconButton>
                                    </a>
                                    <a href="https://www.linkedin.com/in/patrick-eisenschmidt/" target="_blank">
                                        <IconButton size="small">
                                            <LinkedInIcon />
                                        </IconButton>
                                    </a>
                                    <a href="https://twitter.com/secdude_de" target="_blank">
                                        <IconButton size="small">
                                            <TwitterIcon />
                                        </IconButton>
                                    </a>
                                </Stack>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onClose}>Close</Button>
            </CardActions>
        </Card>
    </Dialog>
}