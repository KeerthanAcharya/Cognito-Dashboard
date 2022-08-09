import React from 'react';
import BootstrapTable, { RowEventHandler, TableChangeHandler } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

type Props = {
    keyField: string;
    data: any[];
    columns: any;
    page: number;
    totalSize: number;
    limit: number;
    handleTableChange: TableChangeHandler<any>;
    noDataIndication: string | JSX.Element | (() => string | JSX.Element) | undefined;
    rowEvents?:
        | Partial<{
              onClick: RowEventHandler<any>;
              onDoubleClick: RowEventHandler<any>;
              onMouseEnter: RowEventHandler<any>;
              onMouseLeave: RowEventHandler<any>;
              onContextMenu: RowEventHandler<any>;
          }>
        | undefined;
    tableClasses?: string;
    pointer?: boolean;
    custom?: boolean;
};

export const CustomTable = ({
    keyField,
    columns,
    data,
    handleTableChange,
    page,
    totalSize,
    noDataIndication,
    limit,
    rowEvents,
    tableClasses,
    pointer = true,
    custom = false,
}: Props) => {
    return (
        <BootstrapTable
            keyField={keyField}
            remote
            data={data}
            columns={columns}
            pagination={paginationFactory({
                hidePageListOnlyOnePage: true,
                page: page,
                sizePerPage: limit,
                totalSize: totalSize,
                sizePerPageList: [],
                custom,
            })}
            rowEvents={rowEvents}
            onTableChange={handleTableChange}
            noDataIndication={noDataIndication}
            headerClasses='table-head'
            bodyClasses='table-body'
            rowClasses={(_row, _rowIndex) => (pointer ? 'pointer' : '')}
            classes={tableClasses}
        />
    );
};
