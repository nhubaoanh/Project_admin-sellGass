'use client';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';
import { uploadToCloudinary } from '@/app/api/cloulinary';
import { ProductHeader } from './components/productHeader';
import { ProductTable } from './components/productTable';
import { ProductModal } from './components/productModel';

const Crud = () => {
  let emptyProduct: Demo.sanpham = {
    masp: 0,
    tensp: '',
    maloai: 0,
    thuonghieu: '',
    chatlieu: '',
    mausac: '',
    kieudang: '',
    kichthuoc: '',
    mota: '',
    ngaytao: new Date(),
    tonkho: '',
    gia: 0,
    hinhanh: '',
    action_flag: 1
  };

  const [products, setProducts] = useState<Demo.sanpham[]>([]);
  const [productDialog, setProductDialog] = useState(false);
  const [product, setProduct] = useState<Demo.sanpham>(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState<Demo.sanpham[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [categories, setCategories] = useState<Demo.danhmuc[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    ProductService.getProdctNew().then((data) => {
      setProducts(data as any);
    });
    ProductService.getCategory().then((cats) => {
      setCategories(cats);
    });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
    setFile(null);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setFile(null);
  };

  const saveProduct = async (product: Demo.sanpham) => {
    setSubmitted(true);
    if (!product.tensp.trim()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên sản phẩm là bắt buộc',
        life: 3000,
      });
      return;
    }

    let _products = [...products];
    let _product = { ...product };

    try {
      if (_product.ngaytao instanceof Date && !isNaN(_product.ngaytao.getTime())) {
        const d = _product.ngaytao;
        _product.ngaytao = `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d
          .getHours()
          .toString()
          .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d
          .getSeconds()
          .toString()
          .padStart(2, '0')}` as any;
      } else {
        _product.ngaytao = new Date();
      }

      if (file) {
        const imageUrl = await uploadToCloudinary(file);
        _product.hinhanh = imageUrl;
      }

      if (_product.masp) {
        const updatedProduct = await ProductService.updateProduct(_product.masp, _product);
        const index = findIndexById(_product.masp);
        _products[index] = updatedProduct;
        toast.current?.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Sản phẩm đã được cập nhật',
          life: 3000,
        });
        console.log('updatedProduct', updatedProduct);
      } else {
        const newProduct = await ProductService.createProduct(_product);
        _products.push(newProduct);
        toast.current?.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Sản phẩm đã được tạo',
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
      setFile(null);
      fetchData();
    } catch (error) {
      console.error('Save product failed', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể lưu sản phẩm!',
        life: 3000,
      });
    }
  };

  const editProduct = (product: Demo.sanpham) => {
    setProduct({ ...product });
    setProductDialog(true);
    setFile(null);
  };

  const deleteProduct = async (product: Demo.sanpham) => {
    try {
      await ProductService.deleteProduct(product.masp);
      let _products = products.filter((val) => val.masp !== product.masp);
      setProducts(_products);
      setProduct(emptyProduct);
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
    for (let i = 0; i < products.length; i++) {
      if (products[i].masp === id) {
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
    if (!selectedProducts || selectedProducts.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn ít nhất một sản phẩm để xóa',
        life: 3000,
      });
      return;
    }

    try {
      for (const product of selectedProducts) {
        await ProductService.deleteProduct(product.masp);
      }
      let _products = products.filter((val) => !selectedProducts.includes(val));
      setProducts(_products);
      setSelectedProducts(null);
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

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const val = e.target.value || '';
    setProduct((prev) => ({ ...prev, [name]: val }));
  };

  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    setProduct((prev) => ({ ...prev, [name]: val }));
  };


  // xem lại 
  // const onDropdownChange = (e: any, name: string) => {
  //   const val = e.value;
  //   setProduct((prev) => ({ ...prev, [name]: val }));
  // };
  const onDropdownChange = (e: any, name: string) => {
    console.log(`Dropdown changed: ${name} = ${e.value}`);
    setProduct((prev) => {
        const updatedProduct = {
            ...prev,
            [name]: e.value
        };
        console.log('Updated product:', updatedProduct); // Kiểm tra product sau khi cập nhật
        return updatedProduct;
    });
};

  const onDateChange = (e: { value: Date | null }, name: string) => {
    const val = e.value;
    setProduct((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <ProductHeader
            onNew={openNew}
            onDeleteSelected={deleteSelectedProducts}
            onExport={exportCSV}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            selectedProducts={selectedProducts}
          />
          <ProductTable
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            globalFilter={globalFilter}
            onEdit={editProduct}
            onDelete={deleteProduct}
            onDeleteSelected={deleteSelectedProducts}
          />
          <ProductModal
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
          />
        </div>
      </div>
    </div>
  );
};

export default Crud;