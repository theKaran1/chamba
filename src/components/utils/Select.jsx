import React from 'react'

const Selected = ({register,onChange,children}) => {
  return (
    <>
      <select {...register} onChange={onChange}>{children}</select>
    </>
  )
}

export default Selected
