import React from 'react'
import { ColoredSimpleButton } from 'components/ColoredSimpleButton'
import { SimpleButton } from 'components/SimpleButton'

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
