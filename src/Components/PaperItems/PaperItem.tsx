import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { FunctionComponent } from "react";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: '30px',
    marginTop: '10px'
}));

const ItemSmall = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: '10px',
    marginTop: '5px',
    ':last-child': {
        marginBottom: '10px'
    }
}));

interface PaperItemProps {
    children?: JSX.Element;
    small?: boolean;
}

export const PaperItem: FunctionComponent<PaperItemProps> = ({ children, small = false }) => {
    if (small)
        return <ItemSmall>{children}</ItemSmall>;
    else
        return <Item> {children} </Item>;
}
