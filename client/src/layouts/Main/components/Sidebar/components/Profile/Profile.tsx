import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes, { InferProps } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'fit-content',
    },
    avatar: {
        width: 60,
        height: 60,
    },
    name: {
        marginTop: theme.spacing(1),
    },
}));

const Profile: any = (props: InferProps<typeof Profile.propTypes>): JSX.Element => {
    const { className, ...rest } = props;

    const classes = useStyles();

    const user = {
        name: props.name,
        avatar: props.avatar,
        bio: 'Brain Director',
    };

    return (
        <div {...rest} className={clsx(classes.root, className)}>
            <Avatar alt="Person" className={classes.avatar} component={RouterLink} src={user.avatar} to="/account" />
            <Typography className={classes.name} variant="h4">
                {user.name}
            </Typography>
            <Typography variant="body2">{user.bio}</Typography>
        </div>
    );
};

Profile.propTypes = {
    avatar: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
};

export default Profile;
