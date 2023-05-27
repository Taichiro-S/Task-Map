import TextField from '@mui/material/TextField'

export default function TextFieldForNewWorkspace() {
  return (
    <TextField autoFocus margin="dense" id="title" label="workspace_title" type="text" fullWidth variant="standard" />
  )
}
