import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';

import { useSession } from 'hooks';
import { fetchBackend } from 'helpers';

type OauthReceiverType = {
  code: string;
  exchangeUrl: string;
  saveFunction: (token: any) => void;
  redirectUrl?: string | null;
};

const OauthReceiver: React.FC<OauthReceiverType> = ({
  code,
  exchangeUrl,
  saveFunction,
  redirectUrl = null,
}: OauthReceiverType) => {
  const { user } = useSession();
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getToken = async () => {
      if (code !== undefined) {
        setLoadingToken(true);
        const body = { code };
        const accesstoken = await fetchBackend(exchangeUrl, { method: 'POST', body, user }).catch(err => {
          console.log(err);
        });
        console.log(88888888888, accesstoken);
        if (accesstoken === undefined) return setLoadingToken(false);

        if (accesstoken.success) {
          await saveFunction(accesstoken);
        }
        if (isMounted) setLoadingToken(false);
      }
    };
    getToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadingToken) return <CircularProgress />;

  if (redirectUrl) return <Redirect to={redirectUrl} />;

  return <Redirect to={window.location.pathname} />;
};

export default OauthReceiver;
