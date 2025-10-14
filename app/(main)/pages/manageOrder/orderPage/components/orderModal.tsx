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
    user: Demo.nguoidung;
    submitted: boolean;
    location: Demo.vitri[];
    onHide: () => void;
    onSave: (user: Demo.nguoidung) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onDropdownChange: (e: any, name: string) => void;
}

export const UserModal: React.FC<ProductModalProps> = ({ visible, user, submitted, onHide, onSave, onInputChange, onInputNumberChange, onDropdownChange,location }) => {
    const handleSubmit = () => {
        onSave(user);
    };

    // // Hàm xử lý giá trị ngày để đảm bảo định dạng hợp lệ
    // const parseDate = (date: string | Date | null | undefined): Date | null => {
    //     if (!date) return null;
    //     if (date instanceof Date) return date;
    //     const parsedDate = new Date(date);
    //     return isNaN(parsedDate.getTime()) ? null : parsedDate;
    // };
    const CalendarOptions = [
        { label: 'Ca sáng'},
        { label: 'Ca chiều'},
        { label: 'Cả ngày'},
    ];

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
            <Button label="Save" icon="pi pi-check" text onClick={handleSubmit} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header={user.manv ? 'Cập nhật nhan vien' : 'Thêm nhan vien mới'} modal className="p-fluid" footer={userDialogFooter} onHide={onHide}>
            {/* {product.hinhanh && <img src={product.hinhanh} alt={product.tensp} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
            <div className="field">
                <label htmlFor="hoten">Name</label>
                <InputText id="hoten" value={user.hoten} onChange={(e) => onInputChange(e, 'hoten')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.hoten })} />
                {submitted && !user.hoten && <small className="p-invalid">Name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="maloai">Vi tri</label>
                <Dropdown
                    id="mavt"
                    value={user.mavt}
                    options={location.map((cat) => ({
                        label: cat.tenvt,
                        value: cat.mavt
                    }))}
                    onChange={(e) => onDropdownChange(e, 'mavt')}
                    placeholder="Chọn loại sản phẩm"
                    className="w-full"
                />
            </div>
            <div className="field">
                <label htmlFor="sdt">Number Phone</label>
                <InputTextarea id="sdt" value={user.sdt} onChange={(e) => onInputChange(e, 'sdt')} rows={3} cols={20} />
            </div>
            <div className="field">
                <label htmlFor="email">Email</label>
                <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} />
            </div>
            <div className="formgrid grid">
                <div className="field col-12 md:col-4">
                    <label htmlFor="calendar">Calendar</label>
                    <InputText id="lichlv" value={user.lichlv} onChange={(e) => onInputChange(e, 'lichlv')} />

                    {/* <Dropdown
                        id="lichlv"
                        value={user.lichlv}
                        options={CalendarOptions.map((cat) => ({
                            label: cat.label,
                        }))}
                        onChange={(e) => onDropdownChange(e, 'lichlv')}
                        placeholder="Chọn loại sản phẩm"
                        className="w-full"
                    /> */}
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="password">Pass Word</label>
                    <InputText id="matkhau" value={user.matkhau} onChange={(e) => onInputChange(e, 'matkhau')} />
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="active_flag">Status Active</label>
                    <InputNumber id="active_flag" value={user.active_flag} onValueChange={(e) => onInputNumberChange(e, 'active_flag')} />
                </div>
            </div>
            <div className="field">
                <label htmlFor="lastUpdate_id">UserId update</label>
                <InputNumber id="lastUpdate_id" value={user.lastUpdate_id} onValueChange={(e) => onInputNumberChange(e, 'lastUpdate_id')} />
            </div>
        </Dialog>
    );
};
