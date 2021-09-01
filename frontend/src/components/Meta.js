import { Helmet } from 'react-helmet'
import React, { Component }  from 'react';

const Meta = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}

export default Meta
