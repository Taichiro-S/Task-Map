import { MuiFileInput } from 'mui-file-input'
import React from 'react'

const MuiFileInputWithRef = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div ref={ref}>
      <MuiFileInput {...props} />
    </div>
  )
})

MuiFileInputWithRef.displayName = 'MuiFileInputWithRef'

export default MuiFileInputWithRef
