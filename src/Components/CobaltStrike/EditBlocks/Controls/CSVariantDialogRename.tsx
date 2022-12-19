import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

interface Props {
    show: boolean;
    name: string;
    onValidate: (name: string) => string;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

const EMPTY_ERR = "Enter a name!";

export default function CSVariantDialogRename({ show, name, onValidate, onSubmit, onCancel }: Props) {
    const [newName, setNewName] = useState(name);
    const [error, setError] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value);
        setError(onValidate(event.target.value));
    };

    const reset = () => {
        setNewName("");
        setError(EMPTY_ERR);
    }

    const handleCancel = () => {
        onCancel();
        reset();
    }

    const handleSubmit = () => {
        onSubmit(newName);
        reset();
    }

    return (
        <div>
            <Dialog open={show}>
                <DialogTitle>New variant</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Enter the new name of the variant "${name}":`}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Variant"
                        fullWidth
                        variant="outlined"
                        required
                        value={newName}
                        onChange={handleChange}
                        error={error.length > 0}
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={error.length > 0}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}