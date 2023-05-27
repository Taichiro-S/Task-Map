import React from 'react'
import { ColoredSimpleButton, SimpleButton } from 'components'

const Buttons = () => {
  return (
    <div>
      <ColoredSimpleButton color={'white'} />
      <ColoredSimpleButton color={'red'} />
      <SimpleButton />
    </div>
  )
}

export default Buttons
