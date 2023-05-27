import React, { FC, memo } from 'react'

const Spinner: FC = () => {
  return (
    <div className="my-5 h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
  )
}

export default memo(Spinner)
