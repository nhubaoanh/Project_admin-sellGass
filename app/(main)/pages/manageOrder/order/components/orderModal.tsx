import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { Demo } from '@/types';
import { ProductService } from '@/demo/service/ProductService';
import { CustomerService } from '@/demo/service/CustomerService';

interface OrderModalProps {
    visible: boolean;
    order: Demo.Order;
    submitted: boolean;
    onHide: () => void;
    onSave: (order: Demo.Order) => void;
    onInputChange: (e: any, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onDropdownChange: (e: any, name: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ visible, order, submitted, onHide, onSave, onInputChange, onInputNumberChange, onDropdownChange }) => {
    const [rowProductOptions, setRowProductOptions] = useState<{
        [key: number]: Demo.sanpham[];
    }>({});
    const [customerInfo, setCustomerInfo] = useState<Demo.CustomerCheckRequest>({
        makh: order.makh || 0,
        hoten: '',
        sdt: '',
        diachi: ''
    });

    // ✅ Cập nhật tổng tiền khi items thay đổi
    useEffect(() => {
        const total = order.items?.reduce((sum, item) => sum + (item.dongia || 0), 0) || 0;
        onInputNumberChange({ value: total }, 'tongtien');
    }, [order.items]);

    const handleItemChange = (value: any, field: string, index: number) => {
        const updatedItems = [...(order.items || [])];
        updatedItems[index][field] = value;

        // Tự động cập nhật đơn giá nếu có thay đổi giá hoặc số lượng
        if (['soluong', 'gia'].includes(field)) {
            const gia = updatedItems[index].gia || 0;
            const soluong = updatedItems[index].soluong || 1;
            updatedItems[index].dongia = gia * soluong;
        }

        onInputChange({ target: { value: updatedItems } }, 'items');
    };

    const handleAddItem = () => {
        const newItem = { masp: 0, tensp: '', soluong: 1, gia: 0, dongia: 0 };
        onInputChange({ target: { value: [...(order.items || []), newItem] } }, 'items');
    };

    const handleDeleteItem = (index: number) => {
        const newItems = order.items.filter((_, i) => i !== index);
        onInputChange({ target: { value: newItems } }, 'items');
    };

    const handleSubmit = () => {
        if (!order.ngaydat || isNaN(new Date(order.ngaydat).getTime())) {
            alert('Ngày đặt không hợp lệ!');
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

    const userDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={onHide} />
            <Button label="Lưu" icon="pi pi-check" text onClick={handleSubmit} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '850px' }} header={order.madh ? 'Cập nhật đơn hàng' : 'Thêm đơn hàng mới'} modal className="p-fluid" footer={userDialogFooter} onHide={onHide}>
            {/* === THÔNG TIN KHÁCH HÀNG === */}
            <div className="field">
                <label htmlFor="hoten">Tên khách hàng</label>
                <InputText id="hoten" value={customerInfo.hoten} onChange={(e) => setCustomerInfo({ ...customerInfo, hoten: e.target.value })} placeholder="Nhập tên khách hàng" />
            </div>

            <div className="field">
                <label htmlFor="sdt">Số điện thoại</label>
                <InputText id="sdt" value={customerInfo.sdt} onChange={(e) => setCustomerInfo({ ...customerInfo, sdt: e.target.value })} placeholder="Nhập số điện thoại" />
            </div>

            <div className="field">
                <label htmlFor="diachi">Địa chỉ</label>
                <InputTextarea id="diachi" rows={2} value={customerInfo.diachi} onChange={(e) => setCustomerInfo({ ...customerInfo, diachi: e.target.value })} placeholder="Nhập địa chỉ khách hàng" />
            </div>

            <Button
                label="Kiểm tra khách hàng"
                icon="pi pi-search"
                className="p-button-sm mb-3"
                onClick={async () => {
                    if (!customerInfo.hoten || !customerInfo.sdt || !customerInfo.diachi) {
                        alert('Vui lòng nhập đủ thông tin khách hàng!');
                        return;
                    }

                    try {
                        const result = await CustomerService.getCustomerInfo(customerInfo);
                        if (result?.data?.makh) {
                            onInputNumberChange({ value: result.data.makh }, 'makh');
                            alert(`Khách hàng đã có hoặc đã được thêm mới! Mã KH: ${result.data.makh}`);
                        } else {
                            alert('Không lấy được mã khách hàng.');
                        }
                    } catch (err) {
                        console.error('Lỗi kiểm tra khách hàng:', err);
                        alert('Có lỗi xảy ra khi gọi API kiểm tra khách hàng!');
                    }
                }}
            />

            {/* === THÔNG TIN ĐƠN HÀNG === */}
            <div className="grid grid-cols-2 gap-3">
                <div className="field">
                    <label htmlFor="ngaydat">Ngày đặt</label>
                    <Calendar
                        id="ngaydat"
                        value={order.ngaydat ? new Date(order.ngaydat) : null}
                        onChange={(e) => {
                            const value = e.value ? new Date(e.value).toISOString().slice(0, 19).replace('T', ' ') : '';
                            onInputChange({ target: { value } }, 'ngaydat');
                        }}
                        showTime
                        hourFormat="24"
                        dateFormat="yy-mm-dd"
                    />
                </div>

                <div className="field">
                    <label htmlFor="matrangthai">Trạng thái</label>
                    <Dropdown id="matrangthai" value={order.matrangthai} options={statusOptions} onChange={(e) => onDropdownChange(e, 'matrangthai')} placeholder="Chọn trạng thái" />
                </div>
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
                        field="tensp"
                        header="Tên sản phẩm"
                        body={(rowData, options) => (
                            <Dropdown
                                value={rowData.masp}
                                options={
                                    rowProductOptions[options.rowIndex]?.map((p) => ({
                                        label: p.tensp,
                                        value: p.masp
                                    })) || []
                                }
                                placeholder="Chọn sản phẩm"
                                className="w-full"
                                onFocus={async () => {
                                    if (!rowProductOptions[options.rowIndex]) {
                                        const products = await ProductService.getProdctNew();
                                        setRowProductOptions((prev) => ({
                                            ...prev,
                                            [options.rowIndex]: products
                                        }));
                                    }
                                }}
                                onChange={(e) => {
                                    const selected = rowProductOptions[options.rowIndex]?.find((p) => p.masp === e.value);
                                    if (selected) {
                                        handleItemChange(selected.masp, 'masp', options.rowIndex);
                                        handleItemChange(selected.tensp, 'tensp', options.rowIndex);
                                        handleItemChange(Number(selected.gia), 'gia', options.rowIndex);

                                        // Tính lại đơn giá
                                        const qty = rowData.soluong || 1;
                                        handleItemChange(qty * Number(selected.gia), 'dongia', options.rowIndex);
                                    }
                                }}
                            />
                        )}
                    />

                    <Column
                        field="soluong"
                        header="Số lượng"
                        body={(rowData, options) => (
                            <InputNumber
                                value={rowData.soluong}
                                onValueChange={(e) => {
                                    const newQty = e.value || 1;
                                    handleItemChange(newQty, 'soluong', options.rowIndex);
                                }}
                                min={1}
                            />
                        )}
                    />

                    <Column field="dongia" header="Đơn giá (VND)" body={(rowData) => <InputNumber value={rowData.dongia || 0} mode="currency" currency="VND" locale="vi-VN" disabled />} />

                    <Column header="" body={(_, options) => <Button icon="pi pi-trash" className="p-button-danger p-button-rounded p-button-sm" onClick={() => handleDeleteItem(options.rowIndex)} />} />
                </DataTable>

                <Button label="Thêm sản phẩm" icon="pi pi-plus" className="mt-2" onClick={handleAddItem} />
            </div>

            <div className="field">
                <label htmlFor="tongtien">Tổng tiền</label>
                <InputNumber id="tongtien" value={order.tongtien || 0} mode="currency" currency="VND" locale="vi-VN" disabled />
            </div>

            <div className="field">
                <label htmlFor="paymentMethod">Phương thức thanh toán</label>
                <Dropdown id="paymentMethod" value={order.paymentMethod} options={paymentOptions} onChange={(e) => onDropdownChange(e, 'paymentMethod')} placeholder="Chọn phương thức thanh toán" className="w-full" required />
                {submitted && !order.paymentMethod && <small className="p-error">Phương thức thanh toán là bắt buộc.</small>}
            </div>
        </Dialog>
    );
};
