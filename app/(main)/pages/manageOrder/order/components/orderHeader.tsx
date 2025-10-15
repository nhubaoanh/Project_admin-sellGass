import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import React from 'react';

interface OrderHeaderProps {
    onNew: () => void;
    onDeleteSelected: () => void;
    onExport: () => void;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    selectedOrders: any;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ onNew, onDeleteSelected, onExport, globalFilter, setGlobalFilter, selectedOrders }) => {
    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={onNew} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={onDeleteSelected} disabled={!selectedOrders || !selectedOrders.length} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <>
            <Button label="Export" icon="pi pi-upload" severity="help" onClick={onExport} />
        </>
    );

    return (
        <>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-4">
                <h5 className="m-0">Manage Order</h5>
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={globalFilter} onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
                </span>
            </div>
            <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} />
        </>
    );
};
