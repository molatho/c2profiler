import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Variants } from '../Misc/Styles';
import Grid from '@mui/material/Grid';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
    background: 'none'
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingBottom: "0px",
    paddingRight: theme.spacing(1),
    paddingTop: "0px",
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


interface Props {
    title: string;
    titleVariant?: Variants;
    titleElement?: JSX.Element;
    children?: JSX.Element;
    startExpanded?: boolean;
}

export default function IndentedAccordeon({ title, titleVariant, titleElement, children, startExpanded = false }: Props) {
    const [expanded, setExpanded] = useState(startExpanded);

    const _title = titleElement ? titleElement : <Typography variant={titleVariant}>{title}</Typography>;

    return (
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                {_title}
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}