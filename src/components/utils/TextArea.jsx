import React from 'react'

const TextArea = ({register,error,...rest}) => {
  return (
    <>
        <textarea {...register} {...rest}></textarea>
    </>
  )
}

export default TextArea
