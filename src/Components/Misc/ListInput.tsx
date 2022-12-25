import { Box, Chip, Stack, TextField } from "@mui/material";
import { useState } from "react";

interface Props {
    values: string[];
    setValues: (values: string[]) => void;
    delimiter?: string;
    small?: boolean;
    label?: string;
}

export function ListInput({ values, setValues, delimiter = ",", small = true, label = "" }: Props) {
    const [inputValue, setInputValue] = useState("");

    const handleDelete = (idx: number) => setValues(values.filter((v, i) => i !== idx));

    return <Stack direction="column">
        <Box sx={{ flexWrap: "wrap" }} component="div">
            {values.map((v, i) => <Chip key={i} label={v} onDelete={() => handleDelete(i)} sx={{ m: 1 }} />)}
        </Box>
        <TextField
            label={label}
            size={small ? "small" : undefined}
            placeholder={`Use "${delimiter}" to separate values`}
            value={inputValue}
            onChange={(ev) => {
                const options = ev.target.value.split(delimiter);

                if (options.length > 1) {
                    setValues(
                        values
                            .concat(options)
                            .map((x) => x.trim())
                            .filter((x) => x)
                    );
                    setInputValue("");
                } else {
                    setInputValue(ev.target.value);
                }
            }}
        />

    </Stack>
}
