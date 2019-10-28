import React from 'react';

function VersionFooter() {
    const footerStyle = {
        marginTop: "1rem",
        width: "100%",
        color: "black"
    }

    return <div style={footerStyle}>Version: {process.env.PACKAGE_VERSION}</div>
}

export default VersionFooter
