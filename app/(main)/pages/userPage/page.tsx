'use client';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import React, { use, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';
import { UserHeader } from './components/userHeader';
import { UserTable } from './components/userTable';
import { UserModal } from './components/userModal';
import { UserService } from '@/demo/service/UserService';

const Crud = () => {
    let emptyProduct: Demo.nguoidung = {
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
    const [user, setUser] = useState<Demo.nguoidung>(emptyProduct);
    const [selectedUsers, setSelectedUsers] = useState<Demo.nguoidung[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    // const [categories, setCategories] = useState<Demo.danhmuc[]>([]);
    const [file, setFile] = useState<File | null>(null);
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
        
    };

    const openNew = () => {
        setUser(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
        setFile(null);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setFile(null);
    };

    // const saveProduct = async (user: Demo.nguoidung) => {
    //     setSubmitted(true);
    //     if (!user.hoten.trim()) {
    //         toast.current?.show({
    //             severity: 'error',
    //             summary: 'Lỗi',
    //             detail: 'Tên nguoi dung là bắt buộc',
    //             life: 3000
    //         });
    //         return;
    //     }

    //     let _users = [...users];
    //     let _user = { ...user };

    //     try {
           
    //         if (_user.manv) {
    //             const updatedProduct = await ProductService.updateProduct(_product.masp, _product);
    //             const index = findIndexById(_product.masp);
    //             _products[index] = updatedProduct;
    //             toast.current?.show({
    //                 severity: 'success',
    //                 summary: 'Thành công',
    //                 detail: 'Sản phẩm đã được cập nhật',
    //                 life: 3000
    //             });
    //             console.log('updatedProduct', updatedProduct);
    //         } else {
    //             const newProduct = await ProductService.createProduct(_product);
    //             _products.push(newProduct);
    //             toast.current?.show({
    //                 severity: 'success',
    //                 summary: 'Thành công',
    //                 detail: 'Sản phẩm đã được tạo',
    //                 life: 3000
    //             });
    //         }

    //         setProducts(_products);
    //         setProductDialog(false);
    //         setProduct(emptyProduct);
    //         setFile(null);
    //         fetchData();
    //     } catch (error) {
    //         console.error('Save product failed', error);
    //         toast.current?.show({
    //             severity: 'error',
    //             summary: 'Lỗi',
    //             detail: 'Không thể lưu sản phẩm!',
    //             life: 3000
    //         });
    //     }
    // };

    const editUser = (user: Demo.nguoidung) => {
        setUser({ ...user });
        setProductDialog(true);
        setFile(null);
    };

    const deleteUser = async (user: Demo.nguoidung) => {
        try {
            await UserService.deleteUser(user.manv);
            let _users = users.filter((val) => val.manv !== user.manv);
            setUsers(_users);
            setUser(emptyProduct);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'nhan vien đã được xóa',
                life: 3000
            });
            fetchData();
        } catch (error) {
            console.error('Delete product failed', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xóa sản phẩm',
                life: 3000
            });
        }
    };

    // const findIndexById = (id: number) => {
    //     let index = -1;
    //     for (let i = 0; i < products.length; i++) {
    //         if (products[i].masp === id) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     return index;
    // };

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

    // xem lại
    // const onDropdownChange = (e: any, name: string) => {
    //   const val = e.value;
    //   setProduct((prev) => ({ ...prev, [name]: val }));
    // };
    // const onDropdownChange = (e: any, name: string) => {
    //     console.log(`Dropdown changed: ${name} = ${e.value}`);
    //     setProduct((prev) => {
    //         const updatedProduct = {
    //             ...prev,
    //             [name]: e.value
    //         };
    //         console.log('Updated product:', updatedProduct); // Kiểm tra product sau khi cập nhật
    //         return updatedProduct;
    //     });
    // };

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
                    {/* <UserModal
                        visible={productDialog}
                        product={product}
                        categories={categories}
                        submitted={submitted}
                        onHide={hideDialog}
                        onSave={saveProduct}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onDropdownChange={onDropdownChange}
                        onDateChange={onDateChange}
                        setFile={setFile}
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default Crud;
