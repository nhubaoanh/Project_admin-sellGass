/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
// import { ProductService } from '../../demo/service/ProductService';
// import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { useRouter } from 'next/navigation';
import { ProductService } from '@/demo/service/ProductService';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { OrderService } from '@/demo/service/OrderService';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
// import { useRouter } from 'next/router';

const lineData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

interface DashboardOverview {
    total_orders: number;
    total_revenue: number;
    total_customers: number;
    new_orders_today: number;
    total_hot_products: number;
}

interface DailyStat {
    ngay: string;
    so_don: number;
    tong_doanh_thu: string;
}

const Dashboard = () => {
    const [products, setProducts] = useState<Demo.sanpham[]>([]);
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [currentStat, setCurrentStat] = useState<DailyStat | null>(null);
    const [previousStat, setPreviousStat] = useState<DailyStat | null>(null);
    const formatDate = (date: Date) => date.toISOString().slice(0, 10);
    

    useEffect(() => {
        const res = ProductService.getProductHot().then((data) => setProducts(data));
        const data = OrderService.getDashBroad().then((data) => {
            setOverview(data.overview);
            setDailyStats(data.dailyStats);
        });
        console.log('Danh sách order:', data);
        console.log('Danh sách sản phẩm hot:', res);
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const dateStr = formatDate(selectedDate);
            const current = dailyStats.find((ds) => ds.ngay.slice(0, 10) === dateStr) || null;
            setCurrentStat(current);

            // Tìm ngày trước đó
            const sortedStats = [...dailyStats].sort((a, b) => new Date(a.ngay).getTime() - new Date(b.ngay).getTime());
            const index = sortedStats.findIndex((ds) => ds.ngay.slice(0, 10) === dateStr);
            setPreviousStat(index > 0 ? sortedStats[index - 1] : null);
        } else {
            setCurrentStat(null);
            setPreviousStat(null);
        }
    }, [selectedDate, dailyStats]);

    const formatCurrency = (value: number | string | null | undefined) => {
        return Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };
     const getDelta = (current: number, previous?: number | null) => {
         if (!previous) return 0;
         return current - previous;
     };


     const handleDateChange = (e: { value: Date | null | undefined }) => {
         if (e.value) {
             setSelectedDate(e.value);
             const selectedStr = e.value.toISOString().slice(0, 10);
             const current = dailyStats.find((ds) => ds.ngay.slice(0, 10) === selectedStr) || null;
             setCurrentStat(current);

             // Tìm ngày trước đó
             const sortedStats = [...dailyStats].sort((a, b) => new Date(a.ngay).getTime() - new Date(b.ngay).getTime());
             const index = sortedStats.findIndex((ds) => ds.ngay.slice(0, 10) === selectedStr);
             setPreviousStat(index > 0 ? sortedStats[index - 1] : null);
         } else {
             setSelectedDate(null);
             setCurrentStat(null);
             setPreviousStat(null);
         }
     };

     


    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Orders</span>
                            <div className="text-900 font-medium text-xl">{overview?.total_orders}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{overview?.new_orders_today} new </span>
                    <span className="text-500">since last visit</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Revenue</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(overview?.total_revenue)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-dollar text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">% update </span>
                    <span className="text-500">since last week</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Customers</span>
                            <div className="text-900 font-medium text-xl">{overview?.total_customers}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{overview?.total_hot_products} hot </span>
                    <span className="text-500">products</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Comments</span>
                            <div className="text-900 font-medium text-xl">152 Unread</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </div>
            </div>

            {/* đầy là cấu hình bảng sản phẩm */}

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Sales</h5>
                    <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                        <Column header="Image" body={(data) => <img className="shadow-2" src={data.hinhanh} alt={data.tensp} width="50" />} />
                        <Column field="tensp" header="Name" sortable style={{ width: '35%' }} />
                        <Column field="price" header="Price" sortable style={{ width: '35%' }} body={(data) => formatCurrency(data.gia)} />
                        <Column
                            header="View"
                            style={{ width: '15%' }}
                            body={() => (
                                <>
                                    <Button icon="pi pi-search" text />
                                </>
                            )}
                        />
                    </DataTable>
                </div>

                <div className="card p-4">
                    <h5 className="mb-4">Daily Statistics</h5>

                    <Calendar value={selectedDate} onChange={handleDateChange} showIcon placeholder="Chọn ngày" className="mb-5 w-full" />

                    {currentStat ? (
                        <div className="grid gap-4">
                            <div className="col-12 md:col-4">
                                <Card className="p-3 text-center surface-100">
                                    <div className="text-500 font-medium mb-2">Ngày</div>
                                    <div className="text-900 font-bold text-lg">{currentStat.ngay.slice(0, 10)}</div>
                                </Card>
                            </div>
                            <div className="col-12 md:col-4">
                                <Card className="p-3 text-center surface-100">
                                    <div className="text-500 font-medium mb-2">Số đơn</div>
                                    <div className="text-900 font-bold text-lg">{currentStat.so_don}</div>
                                    {previousStat && (
                                        <div className={`mt-1 text-sm ${getDelta(currentStat.so_don, previousStat.so_don) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {getDelta(currentStat.so_don, previousStat.so_don) >= 0 ? '+' : ''}
                                            {getDelta(currentStat.so_don, previousStat.so_don)}
                                        </div>
                                    )}
                                </Card>
                            </div>
                            <div className="col-12 md:col-4">
                                <Card className="p-3 text-center surface-100">
                                    <div className="text-500 font-medium mb-2">Doanh thu</div>
                                    <div className="text-900 font-bold text-lg">{Number(currentStat.tong_doanh_thu).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                    {previousStat && (
                                        <div className={`mt-1 text-sm ${getDelta(Number(currentStat.tong_doanh_thu), Number(previousStat.tong_doanh_thu)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {getDelta(Number(currentStat.tong_doanh_thu), Number(previousStat.tong_doanh_thu)) >= 0 ? '+' : ''}
                                            {getDelta(Number(currentStat.tong_doanh_thu), Number(previousStat.tong_doanh_thu)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-500 mt-3">Chưa chọn ngày hoặc không có dữ liệu</div>
                    )}
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Overview</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
