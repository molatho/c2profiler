import { styled } from '@mui/material/styles';
import TextField, { StandardTextFieldProps, TextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';


const StyledCodeTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        fontFamily: "ui-monospace, Cascadia Mono, Segoe UI Mono, Liberation Mono, Menlo, Monaco, Consolas, monospace"
    }
});


interface CodeTextProps extends StandardTextFieldProps {
    debounce?: number;
}

export const CodeTextField = (props: CodeTextProps) => {
    const [value, setValue] = useState<string>(props.value ? props.value as string : "");
    const [delay, setDelay] = useState<NodeJS.Timeout | null>(null);

    const _debounce = props.debounce ? props.debounce : 500;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const _value = event.currentTarget.value;
        setValue(_value);
        if (delay) clearTimeout(delay);
        if (props.onChange) setDelay(setTimeout(() => props.onChange && props.onChange(event), _debounce));
        else setValue(_value);
    }

    const clearedProps = {
        ...props,
        value: value,
        onChange: handleChange
    }

    return <>
        <StyledCodeTextField
            {...clearedProps}
        />
    </>
}