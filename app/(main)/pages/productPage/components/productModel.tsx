import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import { Demo } from '@/types';
import { classNames } from 'primereact/utils';

interface ProductModalProps {
    visible: boolean;
    product: Demo.sanpham;
    categories: Demo.danhmuc[];
    submitted: boolean;
    onHide: () => void;
    onSave: (product: Demo.sanpham, file?: File) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onDropdownChange: (e: any, name: string) => void;
    onDateChange: (e: { value: Date | null }, name: string) => void;
    setFile: (file: File | null) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ visible, product, categories, submitted, onHide, onSave, onInputChange, onInputNumberChange, onDropdownChange, onDateChange, setFile }) => {
    const handleSubmit = () => {
        onSave(product);
    };

    // Hàm xử lý giá trị ngày để đảm bảo định dạng hợp lệ
    const parseDate = (date: string | Date | null | undefined): Date | null => {
        if (!date) return null;
        if (date instanceof Date) return date;
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };
     const statusOptions = [
         { label: 'Còn hàng', value: 1 },
         { label: 'Ngừng bán', value: 0 }
     ];

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
            <Button label="Save" icon="pi pi-check" text onClick={handleSubmit} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header={product.masp ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'} modal className="p-fluid" footer={productDialogFooter} onHide={onHide}>
            {product.hinhanh && <img src={product.hinhanh} alt={product.tensp} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            <div className="field">
                <label htmlFor="tensp">Name</label>
                <InputText id="tensp" value={product.tensp} onChange={(e) => onInputChange(e, 'tensp')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.tensp })} />
                {submitted && !product.tensp && <small className="p-invalid">Name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="maloai">Loại sản phẩm</label>
                <Dropdown
                    id="maloai"
                    value={product.maloai}
                    options={categories.map((cat) => ({
                        label: cat.tenloai,
                        value: cat.maloai
                    }))}
                    onChange={(e) => onDropdownChange(e, 'maloai')}
                    placeholder="Chọn loại sản phẩm"
                    className="w-full"
                />
            </div>
            <div className="field">
                <label htmlFor="mota">Description</label>
                <InputTextarea id="mota" value={product.mota} onChange={(e) => onInputChange(e, 'mota')} rows={3} cols={20} />
            </div>
            <div className="field">
                <label htmlFor="thuonghieu">Brand</label>
                <InputText id="thuonghieu" value={product.thuonghieu} onChange={(e) => onInputChange(e, 'thuonghieu')} />
            </div>
            <div className="formgrid grid">
                <div className="field col-12 md:col-4">
                    <label htmlFor="chatlieu">Chất liệu</label>
                    <InputText id="chatlieu" value={product.chatlieu} onChange={(e) => onInputChange(e, 'chatlieu')} />
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="mausac">Màu sắc</label>
                    <InputText id="mausac" value={product.mausac} onChange={(e) => onInputChange(e, 'mausac')} />
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="kichthuoc">Kích thước</label>
                    <InputText id="kichthuoc" value={product.kichthuoc} onChange={(e) => onInputChange(e, 'kichthuoc')} />
                </div>
            </div>
            <div className="field">
                <label htmlFor="kieudang">Kiểu dáng</label>
                <InputText id="kieudang" value={product.kieudang} onChange={(e) => onInputChange(e, 'kieudang')} />
            </div>
            <div className="field">
                <label htmlFor="tonkho">Tồn kho</label>
                <InputText id="tonkho" value={product.tonkho} onChange={(e) => onInputChange(e, 'tonkho')} />
            </div>
            <div className="field">
                <label htmlFor="ngaytao">Ngày tạo</label>
                <Calendar id="ngaytao" value={parseDate(product.ngaytao)} onChange={(e) => onDateChange({ value: e.value as Date | null }, 'ngaytao')} showIcon dateFormat="dd/mm/yy" placeholder="Chọn ngày tạo" readOnlyInput showButtonBar />
            </div>
            <div className="field">
                <label htmlFor="gia">Giá bán</label>
                <InputNumber id="gia" value={product.gia} onValueChange={(e) => onInputNumberChange(e, 'gia')} mode="currency" currency="VND" locale="vi-VN" />
            </div>
            <div className="field">
                <label htmlFor="action_flag">Trạng thái</label>
                <Dropdown id="action_flag" value={product.action_flag} options={statusOptions} onChange={(e) => onDropdownChange(e, 'action_flag')} placeholder="Chọn trạng thái" className="w-full" />
            </div>
            <div className="field">
                <label htmlFor="hinhanh">Hình ảnh</label>
                <FileUpload
                    mode="basic"
                    name="hinhanh"
                    accept="image/*"
                    maxFileSize={1000000}
                    customUpload
                    chooseLabel="Chọn ảnh"
                    onSelect={(e) => {
                        const selectedFile = e.files[0];
                        if (selectedFile) {
                            setFile(selectedFile);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                onInputChange({ target: { value: event.target?.result } } as any, 'hinhanh');
                            };
                            reader.readAsDataURL(selectedFile);
                        }
                    }}
                />
                {product.hinhanh && <img src={product.hinhanh} alt="Preview" width="150" className="mt-3 border-round shadow-2" />}
            </div>
        </Dialog>
    );
};
