import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../../assets/spinner.svg'

export default function Loading(props) {
  const { small } = props
  return (
    <img src={Spinner} alt="loading spinner"
      style={{ width: small ? '20px' : '40px' }} />
  )
}

Loading.propTypes = {
  small: PropTypes.bool
}