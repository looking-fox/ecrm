import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    loading: {
      color: 'black',
      animationDuration: '800ms'
    },
  });

function Loading(props) {
    const {loading} = props.classes
  return (
    <React.Fragment>
        <CircularProgress
        className={loading}
        size={props.small ? 24 : 48}
        thickness={2}/>
    </React.Fragment>
  )
}

Loading.propTypes = {
  small: PropTypes.bool
}

export default withStyles(styles)(Loading)
