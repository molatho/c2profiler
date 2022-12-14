import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface Props<T> {
    item?: T | null;
    itemView: (item: T) => JSX.Element;
    onCreate: () => void;
}

export const CSCreateNew = <T extends unknown>({ item, itemView, onCreate }: Props<T>) => {
    return <>
        {(item != null && item != undefined)
            ? <>{itemView(item)}</>
            : <Button variant="contained" size="small" color="success" startIcon={<AddIcon />} onClick={onCreate}>
                Add
            </Button>
        }
    </>
}