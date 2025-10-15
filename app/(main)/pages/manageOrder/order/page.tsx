'use client';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
// import { uploadToCloudinary } from '@/app/api/cloulinary';
import { OrderHeader } from './components/orderHeader';
import { OrderTable } from './components/orderTable';
import { OrderModal } from './components/orderModal';
import { OrderService } from '@/demo/service/OrderService';

const Crud = () => {
  let emptyProduct: Demo.Order = {
    madh: 0,
    makh: 0,
    ngaydat: new Date().toISOString().slice(0, 19).replace("T", " "),
    diachi_giao: '',
    tongtien: 0,
    paymentMethod: 'COD',
    matrangthai: 1,
    items: [],
  };

  const [orders, setOrders] = useState<Demo.Order[]>([]);
  const [productDialog, setProductDialog] = useState(false);
  const [order, setOrder] = useState<Demo.Order>(emptyProduct);
  const [selectedOrders, setSelectedOrders] = useState<Demo.Order[] | null>(null);
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
      OrderService.getOrder()
          .then((data) => {
              console.log('📦 Data from API:', data);
              if (Array.isArray(data)) {
                  setOrders(data);
              } else {
                  console.error('API returned non-array data:', data);
                  setOrders([]);
              }
          })
          .catch((error) => {
              console.error('Fetch data failed:', error);
              if (error instanceof SyntaxError) {
                  console.log('Response Text:', (error as any).response?.data || 'No response data');
              }
              toast.current?.show({
                  severity: 'error',
                  summary: 'Lỗi',
                  detail: 'Không thể tải dữ liệu từ API!',
                  life: 3000
              });
              setOrders([]);
          });
  };

  

  const openNew = () => {
    setOrder({
        ...emptyProduct,
        paymentMethod: 'COD' // đảm bảo chắc chắn
    });
    setSubmitted(false);
    setProductDialog(true);
    setFile(null);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setFile(null);
  };

  const saveOrder = async (order: Demo.Order) => {
      setSubmitted(true);
      let _orders = [...orders];
      let _order = { ...order };

      // Tính lại tongtien dựa trên items
      const total = _order.items.reduce((sum, item) => sum + (item.gia || 0), 0);
      _order = { ..._order, tongtien: total || _order.tongtien }; // Dùng tổng từ items nếu có

      // Kiểm tra và xử lý ngaydat
      const ngaydat_mysql = _order.ngaydat || new Date().toISOString().slice(0, 19).replace('T', ' ');
      if (isNaN(new Date(ngaydat_mysql).getTime())) {
          toast.current?.show({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Ngày đặt không hợp lệ!',
              life: 3000
          });
          return;
      }

      // Đảm bảo paymentMethod
      _order = {
          ..._order,
          ngaydat: ngaydat_mysql,
          paymentMethod: _order.paymentMethod || 'COD' // Giá trị mặc định
      };
      console.log('Order sent to API:', _order); // Debug trước khi gửi

      try {
          let response;
          if (_order.madh) {
              response = await OrderService.updateOrder(_order.madh, _order);
              console.log('API Response (Update):', response);
              const index = findIndexById(_order.madh);
              if (index !== -1) _orders[index] = response;
          } else {
              response = await OrderService.createOrder(_order);
              console.log('API Response (Create):', response);
              _orders.push(response);
          }

          setOrders(_orders);
          setProductDialog(false);
          setOrder(emptyProduct);
          setFile(null);
          toast.current?.show({
              severity: 'success',
              summary: 'Thành công',
              detail: _order.madh ? 'Đơn hàng đã được cập nhật' : 'Đơn hàng đã được tạo',
              life: 3000
          });
          fetchData();
      } catch (error) {
          console.error('Save product failed', error);
          if (error instanceof SyntaxError) {
              console.log('Response Text:', (error as any).response?.data || 'No response data');
          } else if (error instanceof Error) {
              console.log('Error Message:', error.message);
          }
          toast.current?.show({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể lưu sản phẩm! Kiểm tra API.',
              life: 3000
          });
      }
  };

  const editOrder = (order: Demo.Order) => {
    setOrder({ ...order });
    setProductDialog(true);
    setFile(null);
  };

  const deleteProduct = async (order: Demo.Order) => {
    try {
      await OrderService.deleteOrder(order.madh);
      let _orders = orders.filter((val) => val.madh !== order.madh);
      setOrders(_orders);
      setOrder(emptyProduct);
      toast.current?.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Sản phẩm đã được xóa',
        life: 3000,
      });
    } catch (error) {
      console.error('Delete product failed', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể xóa sản phẩm',
        life: 3000,
      });
    }
  };

  const findIndexById = (id: number) => {
    let index = -1;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].madh === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const deleteSelectedProducts = async () => {
    if (!selectedOrders || selectedOrders.length === 0) {
        toast.current?.show({
            severity: 'warn',
            summary: 'Cảnh báo',
            detail: 'Vui lòng chọn ít nhất một sản phẩm để xóa',
            life: 3000
        });
        return;
    }

    try {
      for (const product of selectedOrders) {
          await OrderService.deleteOrder(product.madh);
      }
      let _products = orders.filter((val) => !selectedOrders.includes(val));
      setOrders(_products);
      setSelectedOrders(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Các sản phẩm đã được xóa',
        life: 3000,
      });
    } catch (error) {
      console.error('Delete selected products failed', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể xóa các sản phẩm',
        life: 3000,
      });
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string; name?: string } }, name: string) => {
      const val = (e.target as { value: string }).value || '';
      setOrder((prev) => {
          const updatedOrder = { ...prev, [name]: val };
          console.log(`Updated ${name}:`, val); // Debug
          return updatedOrder;
      });
  };

  
  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    setOrder((prev) => ({ ...prev, [name]: val }));
  };


  const onDropdownChange = (e: any, name: string) => {
    console.log(`Dropdown changed: ${name} = ${e.value}`);
    setOrder((prev) => {
        const updatedProduct = {
            ...prev,
            [name]: e.value
        };
        console.log('Updated product:', updatedProduct); // Kiểm tra product sau khi cập nhật
        return updatedProduct;
    });
};

  // const onDateChange = (e: { value: Date | null }, name: string) => {
  //   const val = e.value;
  //   setOrder((prev) => ({ ...prev, [name]: val }));
  // };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <OrderHeader
            onNew={openNew}
            onDeleteSelected={deleteSelectedProducts}
            onExport={exportCSV}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            selectedOrders={selectedOrders}
          />
          <OrderTable
            orders={orders}
            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
            globalFilter={globalFilter}
            onEdit={editOrder}
            onDelete={deleteProduct}
            onDeleteSelected={deleteSelectedProducts}
          />
          <OrderModal
            visible={productDialog}
            order={order}
            submitted={submitted}
            onHide={hideDialog}
            onSave={saveOrder}
            onInputChange={onInputChange}
            onInputNumberChange={onInputNumberChange}
            onDropdownChange={onDropdownChange}
            // onDateChange={onDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Crud;