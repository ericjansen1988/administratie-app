import React from 'react';
import { Typography } from '@material-ui/core';

function TabPanel({ children, visible, tab, lazyLoad, ...other }: any) {
  const loadTab = lazyLoad && !visible ? false : true;

  return (
    <Typography component="div" hidden={!visible} id={`simple-tabpanel_${tab}`} role="tabpanel" {...other}>
      {loadTab && children}
    </Typography>
  );
}

export default TabPanel;
