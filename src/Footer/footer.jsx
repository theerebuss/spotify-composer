import React from 'react';

function VersionFooter() {
    const footerStyle = {
        marginTop: "1rem",
        width: "100%",
        color: "black",
        display: "flex",
        flexFlow: "column"
    }

    return <div style={footerStyle}>
        <span>Version: {process.env.PACKAGE_VERSION}</span>
        <span>Environment: {process.env.NODE_ENV}</span>
    </div>
}

export default VersionFooter
