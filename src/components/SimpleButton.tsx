import { useState } from 'react'

const SimpleButton: () => JSX.Element = () => {
  const [state, setState] = useState(false)
  const handleClick = () => {
    setState((prevState) => !prevState)
  }
  return <button onClick={handleClick}>{state ? 'ON' : 'OFF'}</button>
}

export default SimpleButton
