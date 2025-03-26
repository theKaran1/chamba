import React from 'react';

const Label = ({ children, id, className, ...rest }) => {
    return (
        <div className={className || 'label'} id={id || undefined}>
            <label htmlFor="" {...rest}>{children}</label>
        </div>
    );
};

export default Label;