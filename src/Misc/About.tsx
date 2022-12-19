import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogTitle, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import { LogoSmall } from "../Components/Misc/LogoSmall";
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { IconButton } from "@mui/material";
import { grey } from '@mui/material/colors'

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

export const About = ({ open, onClose }: SimpleDialogProps) => {
    return <Dialog onClose={onClose} open={open}>
        <Card sx={{ maxWidth: 700 }}>
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
                <List sx={{ width: '100%', p: 0, m: 0 }}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src="https://avatars.githubusercontent.com/u/43727386" />
                        </ListItemAvatar>
                        <Grid container>
                            <Grid item xs={12}><Typography>Moritz Thomas</Typography></Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography sx={{ color: grey[200] }}>Implementation</Typography>
                                    <div>
                                        <a href="https://github.com/molatho" target="_blank">
                                            <IconButton>
                                                <GitHubIcon />
                                            </IconButton>
                                        </a>
                                        <IconButton>
                                            <LinkedInIcon />
                                        </IconButton>
                                    </div>
                                </Stack>
                            </Grid>
                        </Grid>

                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src="" />
                        </ListItemAvatar>
                        <ListItemText primary="Work" secondary="Jan 7, 2014" />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src="" />
                        </ListItemAvatar>
                        <ListItemText primary="Vacation" secondary="July 20, 2014" />
                    </ListItem>
                </List>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onClose}>Close</Button>
            </CardActions>
        </Card>
    </Dialog>
}