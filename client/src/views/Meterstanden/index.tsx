import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Tab, Tabs, Theme } from '@material-ui/core';

import { OauthReceiver, TabPanel } from 'components';
import { useQueryParams, useSession, useTabs } from 'hooks';
import Overzicht from './components/Overzicht';
import KostenOverzicht from './components/KostenOverzicht';
import Settings from './components/Settings';
import { saveEnelogicSettings } from 'modules/Enelogic';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    //padding: theme.spacing(3)
  },
}));

const Meterstanden = () => {
  const classes = useStyles();
  const { user, userInfo, ref } = useSession();
  const params = useQueryParams();

  const { tab, handleTabChange } = useTabs('overzicht');

  //if there is a query-param named code, the OauthReceiver is returned
  if (params.code) {
    return (
      <OauthReceiver
        code={params.code}
        exchangeUrl="/api/oauth/exchange/enelogic"
        redirectUrl="/meterstanden"
        saveFunction={saveEnelogicSettings(user, ref, userInfo.enelogic)}
      />
    );
  }

  if (!userInfo.enelogic.success) {
    if (tab !== 'settings' && tab !== 'kostenoverzicht') handleTabChange(null, 'settings');
  }

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            aria-label="simple tabs example"
            onChange={handleTabChange}
            scrollButtons="auto"
            value={tab}
            variant="scrollable"
          >
            <Tab label="Overzicht" value="overzicht" disabled={!userInfo.enelogic.success} />
            <Tab label="Kosten overzicht" value="kostenoverzicht" />
            <Tab label="Instellingen" value="settings" />
          </Tabs>
        </AppBar>
        <TabPanel visible={tab === 'overzicht'} tab="overzicht">
          <Overzicht />
        </TabPanel>
        <TabPanel visible={tab === 'kostenoverzicht'} tab="kostenoverzicht">
          <KostenOverzicht />
        </TabPanel>
        <TabPanel visible={tab === 'settings'} tab="settings">
          <Settings />
        </TabPanel>
      </div>
    </div>
  );
};

export default Meterstanden;
