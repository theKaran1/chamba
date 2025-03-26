import React from 'react'

const Input = ({register,error,...rest }) => {
  return (
    <>
        <input {...register} {...rest} />
    
       
       
    </>
  )
}

export default Input
