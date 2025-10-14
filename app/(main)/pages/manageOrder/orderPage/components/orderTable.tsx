import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { Demo } from '@/types';

interface OrderItem {
    // Giả sử cấu trúc của OrderItem dựa trên ngữ cảnh chung (có thể điều chỉnh nếu có thêm chi tiết)
    masp: number;
    tensp: string;
    soluong: number;
    gia: number;
    // Thêm các trường khác nếu cần
}

// interface Order {
//     madh: number;
//     makh: number;
//     ngaydat: string;
//     tongtien: number;
//     matrangthai: number;
//     diachi_giao: string;
//     items: OrderItem[];
//     paymentMethod: string;
// }

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

    const formatCurrency = (value: number | string | null | undefined) => {
        if (value == null || isNaN(Number(value))) return 'N/A';
        return Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const idBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Mã ĐH</span>
            {rowData.madh}
        </>
    );

    const customerIdBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Mã KH</span>
            {rowData.makh}
        </>
    );

    const dateBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Ngày Đặt</span>
            {rowData.ngaydat}
        </>
    );

    const totalBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Tổng Tiền</span>
            {formatCurrency(rowData.tongtien)}
        </>
    );

    const statusBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Mã Trạng Thái</span>
            {rowData.matrangthai}
        </>
    );

    const addressBodyTemplate = (rowData: Demo.Order) => (
        <>
            <span className="p-column-title">Địa Chỉ Giao</span>
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
            <span className="p-column-title">Phương Thức Thanh Toán</span>
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
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                <Column field="madh" header="Mã ĐH" sortable body={idBodyTemplate} headerStyle={{ minWidth: '8rem' }} />
                <Column field="makh" header="Mã KH" sortable body={customerIdBodyTemplate} headerStyle={{ minWidth: '8rem' }} />
                <Column field="ngaydat" header="Ngày Đặt" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                <Column field="tongtien" header="Tổng Tiền" sortable body={totalBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                <Column field="matrangthai" header="Trạng Thái" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '8rem' }} />
                <Column field="diachi_giao" header="Địa Chỉ Giao" body={addressBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }} />
                <Column field="items" header="Số Lượng Items" body={itemsBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                <Column field="paymentMethod" header="Phương Thức TT" body={paymentBodyTemplate} sortable headerStyle={{ minWidth: '12rem' }} />
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
