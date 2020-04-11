import moment from 'moment';
import { fetchBackend } from 'helpers';

const refreshOauth = async (
  session: any,
  url: string,
  accesstoken: any,
  saveFunction: (session: any, token: any) => void,
): Promise<any> => {
  const momentexpires = moment(accesstoken.expires_at);
  console.log(accesstoken);
  if (momentexpires.add(2, 'minutes').isAfter(moment())) return null;
  console.log(
    'Refresh is nodig want expires is verlopen (expires, current)',
    momentexpires.format('YYYY-MM-DD HH:mm'),
    moment().format('YYYY-MM-DD HH:mm'),
  );
  const refreshedToken = await fetchBackend(url, { user: session.user, method: 'POST', body: { token: accesstoken } });
  if (saveFunction !== null) {
    console.log('Saving new accesstoken', refreshedToken);
    await saveFunction(session, refreshedToken);
  }
  return refreshedToken;
};

export default refreshOauth;
