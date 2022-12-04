import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { IC2Provider } from '../Misc/IC2Provider';

interface Props {
    c2s: IC2Provider[];
    onSelect: (c2: IC2Provider | null) => void;
}

export const C2ProviderSelector = ({ c2s, onSelect }: Props) => {
    const [c2, setC2] = useState<IC2Provider|null>(null);

    const getC2ByName = (name: string) : IC2Provider | null => {
        var _c2 = c2s.filter(c2 => c2.name == name);
        if (_c2) return _c2[0];
        return null;
    }

    const handleChange = (event: SelectChangeEvent) => {
        const _c2 = getC2ByName(event.target.value);
        setC2(_c2);
        onSelect(_c2);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} error={!c2}>
            <InputLabel id="demo-simple-select-error-label">C2</InputLabel>
            <Select
                labelId="demo-simple-select-error-label"
                id="demo-simple-select-error"
                value={c2 ? c2.name : ""}
                label="C2"
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {c2s.map((c, i)=> <MenuItem key={i} value={c.name}>{c.name}</MenuItem>)}
            </Select>
        </FormControl>);
}