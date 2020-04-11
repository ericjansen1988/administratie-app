import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';

import { useSession } from 'hooks';
import { fetchBackend } from 'helpers';

type OauthReceiverType = {
  code: string;
  exchangeUrl: string;
  saveFunction: (session: any, token: any) => void;
  redirectUrl?: string | undefined;
  state?: string;
};

const OauthReceiver: React.FC<OauthReceiverType> = ({
  code,
  exchangeUrl,
  saveFunction,
  redirectUrl,
  state,
}: OauthReceiverType) => {
  const session = useSession();
  const [newRedirectUrl, setNewRedirectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    const getToken = async () => {
      if (code !== undefined) {
        const body = { code, state };
        const accesstoken = await fetchBackend(exchangeUrl, { method: 'POST', body, user: session.user }).catch(err => {
          console.log(err);
        });
        console.log(88888888888, accesstoken);
        if (accesstoken === undefined) return setNewRedirectUrl(redirectUrl);
        if (accesstoken.success) {
          await saveFunction(session, accesstoken);
        }

        if (isMounted) setNewRedirectUrl(accesstoken?.data?.state?.origin ?? redirectUrl);
      }
    };
    getToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (newRedirectUrl === undefined) return <CircularProgress />;

  return <Redirect to={newRedirectUrl} />;

  //return <Redirect to={window.location.pathname} />;
};

export default OauthReceiver;
