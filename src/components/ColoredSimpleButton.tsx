import { FC, useState } from 'react'
type Props = {
  color: string
}
const ColoredSimpleButton: FC<Props> = (props) => {
  const [state, setState] = useState(false)
  const handleClick = () => {
    setState((prevState) => !prevState)
  }
  return (
    <button style={{ backgroundColor: props.color }} onClick={handleClick}>
      {state ? 'ON' : 'OFF'}
    </button>
  )
}

export default ColoredSimpleButton
