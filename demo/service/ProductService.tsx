import { Demo } from '@/types';

export const ProductService = {
    getProductsSmall() {
        return fetch('/demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    // getProducts() {
    //     return fetch('/demo/data/products.json', { headers: { 'Cache-Control': 'no-cache' } })
    //         .then((res) => res.json())
    //         .then((d) => d.data as Demo.Product[]);
    // },

    getProdctNew() {
        return fetch('http://localhost:7890/api/sanpham', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => {
                console.log('Dữ liệu trả về:', d);
                // return d.data; // hoặc return d nếu không có d.data
                return d as Demo.sanpham[];
            });
    },

    createProduct(products: Demo.sanpham) {
        return fetch('http://localhost:7890/api/sanpham', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(products)
        }).then((res) => res.json());
    },
    deleteProduct(id: number) {
        return fetch(`http://localhost:7890/api/sanpham/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to delete product');
                }
                return res.json(); // hoặc res.text() nếu API trả về thông báo
            })
            .then((data) => {
                console.log('✅ Product deleted:', data);
                return data;
            });
    },

    getCategory() {
        return fetch('http://localhost:7890/api/danhmuc', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => {
                console.log('Dữ liệu trả về:', d);
                // return d.data; // hoặc return d nếu không có d.data
                return d as Demo.danhmuc[];
            });
    },

    // Bạn cũng nên có một hàm update tương tự
    updateProduct(id: number, product: Demo.sanpham) {
        return fetch(`http://localhost:7890/api/sanpham/${id}`, {
            method: 'PUT', // Hoặc PATCH
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        }).then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = res.json();
            console.log('✅ Product updated:', data);

            
            return data;
        });
    },

    // getProductsWithOrdersSmall() {
    //     return fetch('/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
    //         .then((res) => res.json())
    //         .then((d) => d.data as Demo.Product[]);
    // }
};
