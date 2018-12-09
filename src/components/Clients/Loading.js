import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    loading: {
      color: 'black',
      animationDuration: '800ms',
      position: 'absolute',
      top: '50%',
      zIndex: 5
    },
  });

function Loading(props) {
    const {loading} = props.classes
  return (
    <React.Fragment>
        <CircularProgress
        className={loading}
        size={48}
        thickness={2}/>
    </React.Fragment>
  )
}

export default withStyles(styles)(Loading)
