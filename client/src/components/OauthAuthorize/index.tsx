
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';

import { useSession, useFetch } from 'hooks';

const OauthAuthorize = ({title, formatUrl}: {title: string; formatUrl: string}) => {
  const {user} = useSession();
  const { data: url, request } = useFetch(formatUrl, {cacheKey: ('oauthUrl_' + title.replace(' ', '_')), initialData: ''});
  
  useEffect(() => {
    request.get();
  }, [formatUrl, user])
    
  return (
    <Button 
      color="primary"
      disabled={url === ''}
      href={url}
      variant="contained"
    >
      {title}
    </Button> 
  )
}

export default OauthAuthorize;
