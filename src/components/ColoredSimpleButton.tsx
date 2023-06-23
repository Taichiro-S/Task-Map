import { FC, useState } from 'react'
import { nanoid } from 'nanoid'
type Props = {
  color: string
}
const ColoredSimpleButton: FC<Props> = (props) => {
  const id: string = nanoid()
  const [state, setState] = useState(false)
  const handleClick = () => {
    setState((prevState) => !prevState)
  }
  return (
    <>
      <button style={{ backgroundColor: props.color }} onClick={handleClick}>
        {state ? 'ON' : 'OFF'}
      </button>
      <p>{id}</p>
    </>
  )
}

export default ColoredSimpleButton
