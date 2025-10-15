import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Demo } from '@/types';
import { ProductService } from '@/demo/service/ProductService';
// import ProductService from ''; // API service

interface OrderModalProps {
    visible: boolean;
    order: Demo.Order;
    submitted: boolean;
    onHide: () => void;
    onSave: (order: Demo.Order) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: any } }, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onDropdownChange: (e: any, name: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ visible, order, submitted, onHide, onSave, onInputChange, onInputNumberChange, onDropdownChange }) => {
    const [rowProductOptions, setRowProductOptions] = useState<{ [key: number]: Demo.sanpham[] }>({});

    const handleSubmit = () => {
        if (!order.ngaydat || isNaN(new Date(order.ngaydat).getTime())) {
            console.error('Invalid date format for ngaydat:', order.ngaydat);
            return;
        }
        onSave(order);
    };

    const paymentOptions = [
        { label: 'COD', value: 'COD' },
        { label: 'QR', value: 'QR' }
    ];

    const statusOptions = [
        { label: 'Đang xử lý', value: 1 },
        { label: 'Đang giao', value: 2 },
        { label: 'Hoàn thành', value: 3 },
        { label: 'Đã hủy', value: 4 }
    ];

    const handleItemChange = (value: any, field: string, index: number) => {
        const updatedItems = [...order.items];
        updatedItems[index][field] = value;
        onInputChange({ target: { value: updatedItems } }, 'items');
    };

    const handleAddItem = () => {
        const newItems = [...(order.items || []), { masp: 0, tensp: '', soluong: 1, gia: 0 }];
        onInputChange({ target: { value: newItems } }, 'items');
    };

    const handleDeleteItem = (index: number) => {
        const newItems = order.items.filter((_, i) => i !== index);
        onInputChange({ target: { value: newItems } }, 'items');
    };

    const userDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={onHide} />
            <Button label="Lưu" icon="pi pi-check" text onClick={handleSubmit} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '800px' }} header={order.madh ? 'Cập nhật đơn hàng' : 'Thêm đơn hàng mới'} modal className="p-fluid" footer={userDialogFooter} onHide={onHide}>
            <div className="field">
                <label htmlFor="makh">Mã khách hàng</label>
                <InputNumber id="makh" value={order.makh} onValueChange={(e) => onInputNumberChange(e, 'makh')} />
            </div>

            <div className="field">
                <label htmlFor="ngaydat">Ngày đặt</label>
                <Calendar
                    id="ngaydat"
                    value={order.ngaydat ? new Date(order.ngaydat) : null}
                    onChange={(e) => {
                        const newValue = e.value ? new Date(e.value).toISOString().slice(0, 19).replace('T', ' ') : '';
                        onInputChange({ target: { value: newValue } }, 'ngaydat');
                    }}
                    dateFormat="yy-mm-dd"
                    showTime
                    hourFormat="24"
                    placeholder="Chọn ngày và giờ"
                    className={classNames({ 'p-invalid': submitted && !order.ngaydat })}
                />
                {submitted && !order.ngaydat && <small className="p-error">Ngày đặt là bắt buộc.</small>}
            </div>

            <div className="field">
                <label htmlFor="tongtien">Tổng tiền</label>
                <InputNumber id="tongtien" value={order.tongtien} onValueChange={(e) => onInputNumberChange(e, 'tongtien')} mode="currency" currency="VND" locale="vi-VN" />
            </div>

            <div className="field">
                <label htmlFor="matrangthai">Trạng thái</label>
                <Dropdown id="matrangthai" value={order.matrangthai} options={statusOptions} onChange={(e) => onDropdownChange(e, 'matrangthai')} placeholder="Chọn trạng thái" className="w-full" />
            </div>

            <div className="field">
                <label htmlFor="diachi_giao">Địa chỉ giao</label>
                <InputTextarea id="diachi_giao" value={order.diachi_giao} onChange={(e) => onInputChange(e, 'diachi_giao')} rows={2} />
            </div>

            {/* === CHI TIẾT SẢN PHẨM === */}
            <div className="field">
                <label className="mb-2 block font-medium">Chi tiết sản phẩm</label>
                <DataTable value={order.items || []} responsiveLayout="scroll">
                    <Column
                        field="masp"
                        header="Tên sản phẩm"
                        body={(rowData, options) => (
                            <Dropdown
                                value={rowData.masp}
                                options={rowProductOptions[options.rowIndex]?.map((p) => ({ label: p.tensp, value: p.masp })) || []}
                                placeholder="Chọn sản phẩm"
                                className="w-full"
                                onFocus={async () => {
                                    // Gọi API khi mở dropdown
                                    if (!rowProductOptions[options.rowIndex]) {
                                        try {
                                            const products = await ProductService.getProdctNew();
                                            setRowProductOptions((prev) => ({ ...prev, [options.rowIndex]: products }));
                                        } catch (err) {
                                            console.error('Lấy sản phẩm thất bại', err);
                                        }
                                    }
                                }}
                                onChange={(e) => {
                                    const selected = rowProductOptions[options.rowIndex]?.find((p) => p.masp === e.value);
                                    if (selected) {
                                        handleItemChange(selected.masp, 'masp', options.rowIndex);
                                        handleItemChange(selected.tensp, 'tensp', options.rowIndex);
                                        handleItemChange(selected.gia, 'gia', options.rowIndex);
                                    }
                                }}
                            />
                        )}
                    />
                    <Column field="soluong" header="Số lượng" body={(rowData, options) => <InputNumber value={rowData.soluong} onValueChange={(e) => handleItemChange(e.value || 0, 'soluong', options.rowIndex)} min={1} />} />
                    <Column
                        field="dongia"
                        header="Giá (VND)"
                        body={(rowData, options) => <InputNumber value={rowData.gia} onValueChange={(e) => handleItemChange(e.value || 0, 'gia', options.rowIndex)} mode="currency" currency="VND" locale="vi-VN" />}
                    />
                    <Column header="" body={(_, options) => <Button icon="pi pi-trash" className="p-button-danger p-button-rounded p-button-sm" onClick={() => handleDeleteItem(options.rowIndex)} />} />
                </DataTable>
                <Button label="Add item" icon="pi pi-plus" className="mt-2" onClick={handleAddItem} />
            </div>

            <div className="field">
                <label htmlFor="paymentMethod">Phương thức thanh toán</label>
                <Dropdown id="paymentMethod" value={order.paymentMethod} options={paymentOptions} onChange={(e) => onDropdownChange(e, 'paymentMethod')} placeholder="Chọn phương thức thanh toán" className="w-full" required />
                {submitted && !order.paymentMethod && <small className="p-error">Phương thức thanh toán là bắt buộc.</small>}
            </div>
        </Dialog>
    );
};
