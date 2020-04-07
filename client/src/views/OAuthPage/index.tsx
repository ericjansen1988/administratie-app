import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect, useParams } from 'react-router-dom';

import { useSession, useQueryParams } from 'hooks';
import { OauthAuthorize, OauthReceiver } from 'components';
import { saveEnelogicSettings } from 'modules/Enelogic';

import { enelogicSettings } from 'appcomponents/SettingCardEnelogic';
import { bunqSettings } from 'appcomponents/SettingCardBunq';

const OAuthPage = (): JSX.Element => {
  const { user, ref, userInfo } = useSession();

  const [loading, setLoading] = useState(true);
  //const name: 'bunq' | 'enelogic' = match.params.name.toLowerCase();
  const queryParams = useQueryParams();
  const urlParams: any = useParams();
  const action = urlParams.action.toLowerCase();

  if (!['display', 'format', 'exchange', 'refresh'].includes(action)) {
    return <div>Geen geldige actie</div>;
  }

  const oauthConfig: any = {
    bunq: bunqSettings,
    enelogic: enelogicSettings,
  };

  const name = urlParams.name.toLowerCase();
  const oauthSettings: any = oauthConfig[name];
  if (!oauthSettings) {
    return <>Setting niet gevonden</>;
  }

  if (action === 'format') {
    return <OauthAuthorize title={name} formatUrl={oauthSettings.formatUrl} formatUrlKey={'format_url_' + name} />;
  }
  if (action === 'exchange') {
    console.log(queryParams);
    if (queryParams.code) {
      return (
        <OauthReceiver
          code={queryParams.code}
          exchangeUrl={oauthSettings.exchangeUrl}
          redirectUrl={oauthSettings.redirectUrl}
          saveFunction={oauthSettings.saveFunction}
        />
      );
    } else {
      return <div>Geen code</div>;
    }
  }
  if (action === 'refresh') {
    return (
      <div>
        <Typography variant="h1">OAuth 2.0</Typography>
        <Button>Refresh</Button>
      </div>
    );
  }

  /*
  const refreshToken = async (): Promise<void> => {
    const body = userData.enelogic.data;
    const accesstoken = await fetchBackend('/api/oauth/refresh/enelogic', { method: 'POST', body, user }).catch(err => {
      console.log(err);
    });
    console.log(accesstoken);
    ref
      .update({
        [`${name}.token.access_token`]: accesstoken.data.access_token,
        [`${name}.token.expires_at`]: accesstoken.data.expires_at,
        [`${name}.token.refresh_token`]: accesstoken.data.refresh_token,
      })
      .then(setLoading(false));
    console.log(accesstoken);
  };
  */

  return (
    <div>
      <Typography variant="h1">OAuth 2.0</Typography>
      {!loading && <Redirect to={oauthSettings.redirectUrl} />}
      <Button>Refresh</Button>
    </div>
  );
};

export default OAuthPage;
