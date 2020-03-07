import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useSession, useCache, useFetch } from 'hooks';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const TestPage = (): any => {
  const classes = useStyles();
  const { userInfo } = useSession();
  const { t } = useTranslation();
  const { data, loading, error, request } = useFetch('/api/events', {});

  console.log(data, loading, error);

  useEffect(() => {
    request.get();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item md={7} xs={12}>
          {t('greet')}
          {t('greetName', { name: 'Eric' })}
          <button
            onClick={(): void => {
              request.get();
            }}
          >
            Get data
          </button>
          <button
            onClick={(): void => {
              request.post({ value: 'test123' });
            }}
          >
            Post data
          </button>
          <button
            onClick={(): void => {
              request.put(2, { value: 'test1234' });
            }}
          >
            Put data
          </button>
          <button
            onClick={(): void => {
              request.destroy(3);
            }}
          >
            Delete data
          </button>
        </Grid>
        <Grid item md={5} xs={12}>
          <p>asd</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestPage;
