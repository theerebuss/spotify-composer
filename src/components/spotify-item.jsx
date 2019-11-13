import React from "react"
import { Grid, Typography } from "@material-ui/core"

const imageStyle = {
    width: '450px',
    maxWidth: '100%'
}

function SpotifyItem({ value }) {
    return value ? <Grid container direction="column">
        {
            value.images && value.images.length > 0 ?
                <Grid item>
                    <img style={imageStyle} src={value.images[0].url} alt="album cover" />
                </Grid>

                : null
        }
        <Grid item>
            <Typography variant='h5'>{value.name}</Typography>
            <Typography variant='caption'>{value.tracks.total} tracks</Typography>
        </Grid>
    </Grid> : null
}

export default SpotifyItem