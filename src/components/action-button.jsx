import React from "react"
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'

function ActionButton({ onClick, text, loading }) {
    return <Button onClick={onClick} variant="contained" color="primary">
        {
            loading ?
                <CircularProgress size={24} color="secondary" /> :
                text
        }
    </Button>
}

export default ActionButton