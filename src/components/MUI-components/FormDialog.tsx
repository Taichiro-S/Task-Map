import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

export default function FormDialog() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        ワークスペースを追加
        {/* props.dialogOpenButtonText */}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>新規ワークスペース</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="ワークスペース名"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField id="description" margin="dense" label="説明" multiline rows={3} maxRows={3} fullWidth />
          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleClose}>作成</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
