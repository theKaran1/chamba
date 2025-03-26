import React from 'react';

const Form = ({ onSubmit, children, ...rest }) => { // Change onClick to onSubmit
  return (
    <>
      <form onSubmit={onSubmit} {...rest}> {/* change onClick to onSubmit */}
        {children}
      </form>
    </>
  );
};

export default Form;