import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { Demo } from '@/types';

interface ProductTableProps {
    products: Demo.sanpham[];
    selectedProducts: any;
    setSelectedProducts: (value: any) => void;
    globalFilter: string;
    onEdit: (product: Demo.sanpham) => void;
    onDelete: (product: Demo.sanpham) => void;
    onDeleteSelected: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, selectedProducts, setSelectedProducts, globalFilter, onEdit, onDelete, onDeleteSelected }) => {
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Demo.sanpham | null>(null);

    const formatCurrency = (value: number | string | null | undefined) => {
        if (value == null || isNaN(Number(value))) return 'N/A';
        return Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const codeBodyTemplate = (rowData: Demo.sanpham) => (
        <>
            <span className="p-column-title">Code</span>
            {rowData.masp}
        </>
    );

    const nameBodyTemplate = (rowData: Demo.sanpham) => (
        <>
            <span className="p-column-title">Name</span>
            {rowData.tensp}
        </>
    );

    const priceBodyTemplate = (rowData: Demo.sanpham) => (
        <>
            <span className="p-column-title">Price</span>
            {formatCurrency(rowData.gia as number)}
        </>
    );

    const categoryBodyTemplate = (rowData: Demo.sanpham) => (
        <>
            <span className="p-column-title">Category</span>
            {rowData.maloai}
        </>
    );

    const StatusOrderBodyTemplate = (rowData: Demo.sanpham) => (
        <>
            <span className="p-column-title">Category</span>
            {rowData.action_flag === 0 ? 'hết hàng' : 'Còn hàng'}
        </>
    );

    const imageBodyTemplate = (rowData: Demo.sanpham) => <img src={rowData.hinhanh} alt={rowData.tensp} className="shadow-2" width="100" />;

    const actionBodyTemplate = (rowData: Demo.sanpham) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded severity="success" onClick={() => onEdit(rowData)} />
            <Button
                icon="pi pi-trash"
                rounded
                severity={rowData.action_flag === 0 ? 'danger' : 'warning' as 'danger' | 'warning'}
                disabled={rowData.action_flag === 0}
                onClick={() => {
                    setProductToDelete(rowData);
                    setDeleteDialogVisible(true);
                }}
            />
        </div>
    );

    const confirmDelete = () => {
        if (productToDelete) {
            onDelete(productToDelete);
        } else if (selectedProducts && selectedProducts.length > 0) {
            onDeleteSelected();
        }
        setDeleteDialogVisible(false);
        setProductToDelete(null);
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
                value={products}
                selection={selectedProducts}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
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
                <Column field="masp" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
                <Column field="tensp" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
                <Column header="Image" body={imageBodyTemplate} />
                <Column field="gia" header="Price" body={priceBodyTemplate} sortable />
                <Column field="trangthai" header="StatusProduct" body={StatusOrderBodyTemplate} sortable />
                <Column field="maloai" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
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
                    setProductToDelete(null);
                }}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>{productToDelete ? `Are you sure you want to delete ${productToDelete.tensp}?` : 'Are you sure you want to delete the selected products?'}</span>
                </div>
            </Dialog>
        </>
    );
};
