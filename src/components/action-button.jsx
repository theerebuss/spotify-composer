import React from "react"
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'

const buttonStyle = {
    width: '100%',
    maxWidth: '450px'
}

function ActionButton({ onClick, text, loading, variant }) {
    return <Button onClick={onClick} variant={variant || 'contained'} color="primary" style={buttonStyle}>
        {
            loading ?
                <CircularProgress size={24} color="secondary" /> :
                text
        }
    </Button>
}

export default ActionButton