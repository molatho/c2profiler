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
    onValidate: (name: string) => string;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

const EMPTY_ERR = "Enter a name!";

export default function CSVariantDialog({ show, onValidate, onSubmit, onCancel }: Props) {
    const [name, setName] = useState("");
    const [error, setError] = useState(EMPTY_ERR);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        setError(onValidate(event.target.value));
    };

    const reset = () => {
        setName("");
        setError(EMPTY_ERR);
    }

    const handleCancel = () => {
        onCancel();
        reset();
    }

    const handleSubmit = () => {
        onSubmit(name);
        reset();
    }

    return (
        <div>
            <Dialog open={show}>
                <DialogTitle>New variant</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of the variant you'd like to add:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Variant"
                        fullWidth
                        variant="outlined"
                        required
                        value={name}
                        onChange={handleChange}
                        error={error.length > 0}
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={error.length > 0}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}