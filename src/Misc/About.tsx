import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Dialog, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
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
        <Card sx={{ maxWidth: 400 }}>
            <CardMedia
                component="div"
            ><LogoSmall /></CardMedia>
            <CardContent>
                {/* About */}
                <Typography gutterBottom variant="h5">
                    About
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" sx={{ mb: "2em" }}>
                    TBD
                </Typography>
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
                    Special thanks to 
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" sx={{ mb: "2em" }}>
                    Credits where credits are due! The following people supported the development either directly or indirectly.
                </Typography>
                <List sx={{ width: '100%', p: 0, m: 0 }}>
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