import React from "react"
import { Grid, Typography } from "@material-ui/core"

const imageStyle = {
    width: '100%',
    maxWidth: '450px'
}

function SpotifyItem({ item }) {
    return <Grid container direction="column">
        {
            item.images && item.images.length > 0 ?
                <Grid item>
                    <img src={item.images[0].url} style={imageStyle} alt="album cover" />
                </Grid>

                : null
        }
        <Grid item>
            <Typography variant='h5'>{item.name}</Typography>
            <Typography variant='caption'>{item.tracks.total} tracks</Typography>
        </Grid>
    </Grid>
}

export default SpotifyItem