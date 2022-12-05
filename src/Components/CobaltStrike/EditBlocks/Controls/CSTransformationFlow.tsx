// Tranforms: (append [i][+]) (mask[i][+])
// Flow (append [operand][h/s][x]) => (mask [x]) =>  

import { Tooltip, Chip, Stack, Grid, Typography, TextField, Card, CardContent, Button, IconButton } from "@mui/material";
import { IMetaTransformDefinition, TransformDisplayNames, TransformName, TransformNames } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { ICSBlockTransformInformation, ICSDataTransform } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import InfoIcon from '@mui/icons-material/Info';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './CSTransformationFlow.css';


interface InfoAddChipProps {
    label?: string;
    description?: string;
    onClick: () => void;
}

const InfoAddChip = ({ label, description, onClick }: InfoAddChipProps) => {
    const icon = description ? <Tooltip title={description}><InfoIcon /></Tooltip> : undefined;

    return (
        <Chip
            label={label}
            variant="outlined"
            onDelete={() => onClick()}
            deleteIcon={<AddCircleIcon />}
            icon={icon}
        />
    )
}

interface TransformItemProps {
    meta: IMetaTransformDefinition;
    transform: ICSDataTransform;
    onChanged: () => void;
    onRemove: () => void;
}

const TransformItem = ({ meta, transform, onChanged, onRemove }: TransformItemProps) => {
    const onValueChanged = (value: string) => {
        transform.operand = value;
        onChanged();
    }

    return <Card sx={{ maxWidth: 300 }} variant="outlined">
        <CardContent className="TranformCard">
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                    <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Grid item>
                            <Typography>{TransformDisplayNames.get(transform.type)}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton color="error" size="small" onClick={onRemove}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                {meta.operand && <>
                    <Grid item xs>
                        <TextField
                            value={transform.operand ? transform.operand : ""}
                            onChange={(ev) => onValueChanged(ev.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            size="small"
                            multiline
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="small" sx={{ minWidth: 0 }}>
                            H
                        </Button>
                    </Grid>
                </>}
            </Grid>
        </CardContent>
    </Card>
}

interface Props {
    profile: any;
    flow: ICSBlockTransformInformation;
    onProfileChanged: (profile: any) => void;
}

export const CSTransformationFlow = ({ profile, flow, onProfileChanged }: Props) => {
    const addTransform = (name: TransformName) => {
        flow.transforms.push({
            "type": name
        });
        onProfileChanged({ ...profile });
    }

    const removeTransform = (idx: number) => {
        flow.transforms = flow.transforms.filter((_, i) => i != idx);
        onProfileChanged({ ...profile });
    }

    const getMetadata = (name: TransformName): IMetaTransformDefinition => metadata.transforms[name] as IMetaTransformDefinition;

    return <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {/* Transform selection */}
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography>Transformations:</Typography>
                    {TransformNames.map((n, i) => <InfoAddChip key={i} label={TransformDisplayNames.get(n)} description={getMetadata(n).description} onClick={() => addTransform(n)} />)}
                </Stack>
            </Grid>
            <Grid item xs={12}>
                {/* Flow display */}
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Typography>Resulting chain:</Typography>
                    </Grid>

                    {flow.transforms.length > 0
                        ? flow.transforms.map((t, i) => <Grid item xs={2}>
                            <TransformItem meta={getMetadata(t.type)} transform={t} onChanged={() => onProfileChanged(profile)} onRemove={() => removeTransform(i)} />
                        </Grid>)
                        : <Typography sx={{ fontStyle: 'italic' }}>Empty - Add transformation steps!</Typography>}

                </Grid>
            </Grid>
        </Grid>
    </>
}