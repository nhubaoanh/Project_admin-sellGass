import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { Demo } from '@/types';

interface ProductTableProps {
    users: Demo.nguoidung[];
    selectedUsers: any;
    setSelectedUsers: (value: any) => void;
    globalFilter: string;
    onEdit: (product: Demo.nguoidung) => void;
    onDelete: (product: Demo.nguoidung) => void;
    onDeleteSelected: () => void;
}

export const UserTable: React.FC<ProductTableProps> = ({ users, selectedUsers, setSelectedUsers, globalFilter, onEdit, onDelete, onDeleteSelected }) => {
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState<Demo.nguoidung | null>(null);

    // const formatCurrency = (value: number | string | null | undefined) => {
    //     if (value == null || isNaN(Number(value))) return 'N/A';
    //     return Number(value).toLocaleString('vi-VN', {
    //         style: 'currency',
    //         currency: 'VND'
    //     });
    // };

    const codeBodyTemplate = (rowData: Demo.nguoidung) => (
        <>
            <span className="p-column-title">Code</span>
            {rowData.manv}
        </>
    );

    const nameBodyTemplate = (rowData: Demo.nguoidung) => (
        <>
            <span className="p-column-title">Name</span>
            {rowData.hoten}
        </>
    );

    // const priceBodyTemplate = (rowData: Demo.sanpham) => (
    //     <>
    //         <span className="p-column-title">Price</span>
    //         {formatCurrency(rowData.gia as number)}
    //     </>
    // );

    const idLocationBodyTemplate = (rowData: Demo.nguoidung) => (
        <>
            <span className="p-column-title">Code location</span>
            {rowData.mavt}
        </>
    );

    const numberPhoneBodyTemplate = (rowData: Demo.nguoidung) => (
        <>
            <span className="p-column-title">Code location</span>
            {rowData.sdt}
        </>
    );

    const addressEmailBodyTemplate = (rowData: Demo.nguoidung) => (
        <>
            <span className="p-column-title">Code location</span>
            {rowData.email}
        </>
    );

    const passBodyTemplate = (rowData: Demo.nguoidung) => (
        <>
            <span className="p-column-title">Code location</span>
            {rowData.matkhau}
        </>
    );

    const userUpdateBodyTemplate = (rowData: Demo.nguoidung) => (
        <>
            <span className="p-column-title">userUpdate</span>
            {rowData.lastUpdate_id}
        </>
    );

    // const imageBodyTemplate = (rowData: Demo.sanpham) => <img src={rowData.hinhanh} alt={rowData.tensp} className="shadow-2" width="100" />;

    const actionBodyTemplate = (rowData: Demo.nguoidung) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded severity="success" onClick={() => onEdit(rowData)} />
            <Button
                icon="pi pi-trash"
                rounded
                severity={rowData.active_flag === 0 ? 'danger' : ('warning' as 'danger' | 'warning')}
                disabled={rowData.active_flag === 0}
                onClick={() => {
                    setUserToDelete(rowData);
                    setDeleteDialogVisible(true);
                }}
            />
        </div>
    );

    const confirmDelete = () => {
        if (userToDelete) {
            onDelete(userToDelete);
        } else if (selectedUsers && selectedUsers.length > 0) {
            onDeleteSelected();
        }
        setDeleteDialogVisible(false);
        setUserToDelete(null);
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
                value={users}
                selection={selectedUsers}
                onSelectionChange={(e) => setSelectedUsers(e.value)}
                dataKey="masp"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter}
                emptyMessage="Không tìm thấy sản phẩm."
                responsiveLayout="scroll"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                <Column field="masp" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '4rem' }} />
                <Column field="tensp" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
                <Column field="mavt" header="Code location" body={idLocationBodyTemplate} sortable />
                <Column field="sdt" header="Number phone" body={numberPhoneBodyTemplate} sortable />
                <Column field="email" header="Address Email" body={addressEmailBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }} />
                <Column field="matkhau" header="Pass Word" body={passBodyTemplate} sortable />
                <Column field="lastUpdate_id" header="Id User Update" body={userUpdateBodyTemplate} sortable />
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
                    setUserToDelete(null);
                }}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>{userToDelete ? `Are you sure you want to delete ${userToDelete.hoten}?` : 'Are you sure you want to delete the selected products?'}</span>
                </div>
            </Dialog>
        </>
    );
};
