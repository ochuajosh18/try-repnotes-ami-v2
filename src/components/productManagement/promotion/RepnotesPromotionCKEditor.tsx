import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface RepnotesInputProps {
    id: string;
    label?: string;
    onChange: (field: string, value: string | number | boolean | Array<string>) => void;
    field: string;
    value: string;
    disabled?: boolean;

}

export const RepnotesCKEditor = (props: RepnotesInputProps) => {

    const { onChange, value, label, id, field, disabled } = props;

    return (
        <Box>
            <Grid container>
                <Grid item xs={4} style={{ textAlign: 'right', paddingRight: '15px', paddingTop: '12px' }}>
                    <Typography 
                        style={{
                            padding: '3px 0',
                            fontSize: 12, 
                            fontWeight: 700,
                            color: '#272B75'
                        }}
                    >
                        {label}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Box style={{ textAlign: 'left', paddingTop: 10, paddingBottom: 10 }}>
                        <CKEditor
                            id={id}
                            data={value}
                            disabled={disabled}
                            editor={ClassicEditor}
                            onInit={(editor: any) => {
                                // You can store the "editor" and use when it is needed.
                                // console.log("Editor is ready to use!", editor);
                                editor.editing.view.change((writer: any) => {
                                    writer.setStyle(
                                        "height",
                                        "200px",
                                        editor.editing.view.document.getRoot()
                                    );
                                    writer.setStyle(
                                        "font-size",
                                        "12px",
                                        editor.editing.view.document.getRoot()
                                    );
                                });
                            }}
                            config={{         
                                toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                                  'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo', 'redo']
                            }}
                            onChange={(event: any, editor: any) => {
                                onChange(field, editor.getData())
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}