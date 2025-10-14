'use client';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import React, { use, useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { UserHeader } from './components/userHeader';
import { UserTable } from './components/userTable';
import { UserModal } from './components/userModal';
import { UserService } from '@/demo/service/UserService';

const Crud = () => {
    let emptyUser: Demo.nguoidung = {
        manv: 0,
        hoten: '',
        mavt: 0,
        sdt: '',
        email: '',
        lichlv: '',
        matkhau: '',
        active_flag: 1,
        lastUpdate_id: 0
    };

    const [users, setUsers] = useState<Demo.nguoidung[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [user, setUser] = useState<Demo.nguoidung>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<Demo.nguoidung[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [location, setLocation] = useState<Demo.vitri[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        UserService.getUser().then((data) => {
            setUsers(data as any);
            // console.log('data', data);
        });

        UserService.getLocation().then((loc) => {
            setLocation(loc);
            console.log('loc _ma vi tris cua mik : ', loc);
        });
        
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const saveProduct = async (user: Demo.nguoidung) => {
        setSubmitted(true);
        if (!user.hoten.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Tên nguoi dung là bắt buộc',
                life: 3000
            });
            return;
        }

        let _users = [...users];
        let _user = { ...user };

        try {
           
            if (_user.manv) {
                const updatedProduct = await UserService.updateUser(_user.manv, _user);
                const index = findIndexById(_user.manv);
                _users[index] = updatedProduct;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Sản phẩm đã được cập nhật',
                    life: 3000
                });
                console.log('updatedProduct', updatedProduct);
            } else {
                const newProduct = await UserService.createUser(_user);
                _users.push(newProduct);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Sản phẩm đã được tạo',
                    life: 3000
                });
            }

            setUsers(_users);
            setProductDialog(false);
            setUser(emptyUser);
            // setFile(null);
            fetchData();
        } catch (error) {
            console.error('Save product failed', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể lưu sản phẩm!',
                life: 3000
            });
        }
    };

    const editUser = (user: Demo.nguoidung) => {
        setUser({ ...user });
        setProductDialog(true);
    };

    const deleteUser = async (user: Demo.nguoidung) => {
        try {
            // Gọi service và nhận data (phải return affectedRows từ UserService)
            const result = await UserService.deleteUser(user.manv);

            // Kiểm tra affectedRows từ server (giả định UserService trả về)
            if (!result || result.affectedRows === 0) {
                throw new Error(result?.message || 'Không xóa được - 0 rows affected');
            }

            // Chỉ cập nhật UI nếu thành công thực
            let _users = users.filter((val) => val.manv !== user.manv);
            setUsers(_users);
            setUser(emptyUser); // Sửa từ emptyProduct → emptyUser
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Nhân viên đã được xóa',
                life: 3000
            });

            fetchData(); // Reload để đồng bộ với CSDL
            // console.log('Xóa thành công:', result);
        } catch (error: any) {
            console.error('Delete user failed:', error); // Sửa từ 'product'
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message || 'Không thể xóa nhân viên', // Sửa từ 'sản phẩm'
                life: 3000
            });
            // Không cập nhật store nếu lỗi → giữ nguyên dữ liệu cũ
        }
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].manv === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const deleteSelectedUsers = async () => {
        if (!selectedUsers || selectedUsers.length === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn ít nhất một sản phẩm để xóa',
                life: 3000
            });
            return;
        }

        try {
            for (const user of selectedUsers) {
                await UserService.deleteUser(user.manv);
            }
            let _users = users.filter((val) => !selectedUsers.includes(val));
            setUsers(_users);
            setSelectedUsers(null);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Các nhan vien đã được xóa',
                life: 3000
            });
        } catch (error) {
            console.error('Delete selected products failed', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xóa các sản phẩm',
                life: 3000
            });
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target.value || '';
        setUser((prev) => ({ ...prev, [name]: val }));
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        setUser((prev) => ({ ...prev, [name]: val }));
    };

    const onDropdownChange = (e: any, name: string) => {
        console.log(`Dropdown changed: ${name} = ${e.value}`);
        setUser((prev) => {
            const updatedUser = {
                ...prev,
                [name]: e.value
            };
            console.log('Updated product:', updatedUser); // Kiểm tra product sau khi cập nhật
            return updatedUser;
        });
    };

    // const onDateChange = (e: { value: Date | null }, name: string) => {
    //     const val = e.value;
    //     setProduct((prev) => ({ ...prev, [name]: val }));
    // };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <UserHeader onNew={openNew} onDeleteSelected={deleteSelectedUsers} onExport={exportCSV} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} selectedUsers={selectedUsers} />
                    <UserTable users={users} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} globalFilter={globalFilter} onEdit={editUser} onDelete={deleteUser} onDeleteSelected={deleteSelectedUsers} />
                    <UserModal
                        visible={productDialog}
                        user={user}
                        location={location}
                        submitted={submitted}
                        onHide={hideDialog}
                        onSave={saveProduct}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onDropdownChange={onDropdownChange}

                    />
                </div>
            </div>
        </div>
    );
};

export default Crud;
