import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { EditorView } from "@codemirror/view";
import { http } from '@codemirror/legacy-modes/mode/http';
import { Grid } from '@mui/material';

interface HttpProps {
    text: string;
}

const HttpView = ({ text }: HttpProps) => {
    const [wrap, setWrap] = useState(true);

    const opts = wrap ? [StreamLanguage.define(http), EditorView.lineWrapping] : [StreamLanguage.define(http)];

    return <Grid container>
        <Grid item xs={12}>
            {/* TODO: Add buttons (e.g. toggle wrapping)*/}
        </Grid>
        <Grid item xs={12}>
            <CodeMirror
                value={text}
                height="400px"
                theme="dark"
                readOnly
                extensions={opts}
            />
        </Grid>
    </Grid>
}


interface Props {
    request: string;
    response: string;
}

export const HttpVisualizer = ({ request, response }: Props) => {

    const getCodeMirror = (_http: string) => {
        return <CodeMirror
            value={_http}
            height="400px"
            theme="dark"
            readOnly
            extensions={[StreamLanguage.define(http), EditorView.lineWrapping]}
        />
    }

    return <>
        <Grid container>
            <Grid item xs={12}>
                <HttpView text={request} />
            </Grid>
            <Grid item xs={12}>
                <HttpView text={response} />
            </Grid>
        </Grid>
    </>
}

function useState(arg0: boolean): [any, any] {
    throw new Error('Function not implemented.');
}
