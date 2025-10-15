import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { Demo } from '@/types';


interface OrderTableProps {
    orders: Demo.Order[];
    selectedOrders: any;
    setSelectedOrders: (value: any) => void;
    globalFilter: string;
    onEdit: (order: Demo.Order) => void;
    onDelete: (order: Demo.Order) => void;
    onDeleteSelected: () => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, selectedOrders, setSelectedOrders, globalFilter, onEdit, onDelete, onDeleteSelected }) => {
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Demo.Order | null>(null);
    const [expandedRows, setExpandedRows] = useState<any>(null);

    const formatCurrency = (value: number | string | null | undefined) => {
        if (value == null || isNaN(Number(value))) return 'N/A';
        return Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const idBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Code order</span>
            {rowData.madh}
        </>
    );

    const customerIdBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Code custommer</span>
            {rowData.makh}
        </>
    );

    const dateBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Date set</span>
            {rowData.ngaydat}
        </>
    );

    const totalBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Total Price</span>
            {formatCurrency(rowData.tongtien)}
        </>
    );

    const statusBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Status</span>
            {rowData.matrangthai}
        </>
    );

    const addressBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Address</span>
            {rowData.diachi_giao}
        </>
    );

    const itemsBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Items</span>
            {rowData.items.length} sản phẩm
            {/* Nếu muốn hiển thị chi tiết, có thể dùng Tooltip hoặc expand row */}
        </>
    );

    const paymentBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">PaymentMethod</span>
            {rowData.paymentMethod}
        </>
    );

    const actionBodyTemplate = (rowData: Demo.Order) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded severity="success" onClick={() => onEdit(rowData)} />
            <Button
                icon="pi pi-trash"
                rounded
                severity="danger"
                onClick={() => {
                    setOrderToDelete(rowData);
                    setDeleteDialogVisible(true);
                }}
            />
        </div>
    );

    const confirmDelete = () => {
        if (orderToDelete) {
            onDelete(orderToDelete);
        } else if (selectedOrders && selectedOrders.length > 0) {
            onDeleteSelected();
        }
        setDeleteDialogVisible(false);
        setOrderToDelete(null);
    };

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={() => setDeleteDialogVisible(false)} />
            <Button label="Yes" icon="pi pi-check" text onClick={confirmDelete} />
        </>
    );

    const rowExpansionTemplate = (order: Demo.Order) => {
        return (
            <div className="p-3">
                <h6>Detail order</h6>
                <DataTable value={order.items} responsiveLayout="scroll" size="small">
                    <Column field="masp" header="Code product" style={{ width: '8rem' }} />
                    <Column field="tensp" header="Name product" style={{ width: '15rem' }} />
                    <Column field="soluong" header="Quantity" style={{ width: '8rem' }} />
                    <Column
                        field="gia"
                        header="Giá"
                        body={(rowData) =>
                            Number(rowData.dongia).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            })
                        }
                        style={{ width: '10rem' }}
                    />
                </DataTable>
            </div>
        );
    };


    return (
        <>
            <DataTable
                value={orders}
                selection={selectedOrders}
                onSelectionChange={(e) => setSelectedOrders(e.value)}
                dataKey="madh"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                globalFilter={globalFilter}
                emptyMessage="Không tìm thấy đơn hàng."
                responsiveLayout="scroll"
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
            >
                <Column expander style={{ width: '3rem' }} />
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                <Column field="madh" header="Code order" sortable body={idBodyTemplate} headerStyle={{ minWidth: '8rem' }} />
                <Column field="makh" header="customer code" sortable body={customerIdBodyTemplate} headerStyle={{ minWidth: '8rem' }} />
                <Column field="ngaydat" header="Booking date" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                <Column field="tongtien" header="Total amount" sortable body={totalBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                <Column field="matrangthai" header="Status" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '8rem' }} />
                <Column field="diachi_giao" header="Delivery address" body={addressBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }} />
                <Column field="items" header="Quantity Items" body={itemsBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                <Column field="paymentMethod" header="Payment method" body={paymentBodyTemplate} sortable headerStyle={{ minWidth: '12rem' }} />
                <Column header="Actions" body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
            </DataTable>

            <Dialog
                visible={deleteDialogVisible}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={deleteDialogFooter}
                onHide={() => {
                    setDeleteDialogVisible(false);
                    setOrderToDelete(null);
                }}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>{orderToDelete ? `Are you sure you want to delete order ${orderToDelete.madh}?` : 'Are you sure you want to delete the selected orders?'}</span>
                </div>
            </Dialog>
        </>
    );
};
