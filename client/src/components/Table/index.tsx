/* eslint-disable react/no-multi-comp */

import React from 'react';
import MaterialTable, { MTableEditField } from 'material-table';

export const RequiredField = (props: any): JSX.Element => {
    if (props.columnDef.required && props.value === undefined) {
        return <MTableEditField {...props} />;
    }
    if (props.columnDef.required && props.value.length === 0) {
        return <MTableEditField {...props} error label="Required" />;
    }
    return <MTableEditField {...props} />;
};

const Table = (props: any): any => {
    let { options, ...rest } = props;

    if (options === undefined) options = {};
    if (!options.padding) options.padding = 'dense';
    if (options.exportButton && !options.exportDelimiter) options.exportDelimiter = ';';
    if (!options.pageSize) options.pageSize = 10;

    return (
        <MaterialTable
            components={{
                EditField: RequiredField,
            }}
            options={options}
            {...rest}
        />
    );
};

export default Table;
