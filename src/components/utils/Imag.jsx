import React from 'react'

const Imag = ({src,...rest}) => {
  return (
    <>
      <img src={src} {...rest}/>
    </>
  )
}

export default Imag
