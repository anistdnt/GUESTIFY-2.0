import React from 'react'

type Props = {}

function Loading({}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40" style={{'zIndex': 99}}>
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default Loading;