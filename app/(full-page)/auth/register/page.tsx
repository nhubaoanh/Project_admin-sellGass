'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useCallback } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { CustomerService } from '@/demo/service/CustomerService';
import { userStorage } from '@/demo/service/userStorage';
import { AuthService } from '@/demo/service/AuthService';

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ LOGIN STATE - CHỈ EMAIL + PASSWORD
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // ✅ REGISTER STATE - CHỈ EMAIL + PASSWORD
    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    // ✅ VALIDATE REGISTER - CHỈ EMAIL + PASSWORD
    const validateRegister = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        // ✅ EMAIL VALIDATION
        if (!registerData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // ✅ PASSWORD VALIDATION
        if (!registerData.password.trim()) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        // ✅ CONFIRM PASSWORD
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [registerData]);

    // ✅ REGISTER HANDLER - ĐƠN GIẢN
    const handleRegister = useCallback(async () => {
        if (!validateRegister()) return;

        setLoading(true);
        setErrors({});

        try {
            // ✅ TẠO CUSTOMER VỚI HỌ TÊN MẶC ĐỊNH
            const customer = {
                hoten: 'Khách hàng', // ✅ MẶC ĐỊNH
                email: registerData.email.trim(),
                password: registerData.password.trim(),
                sdt: '', // Trống
                diachi: '', // Trống
                gioitinh: 'Khác', // Mặc định
                diemtl: 0
            };

            console.log('📤 Đăng ký:', customer);

            // ✅ GỌI API TẠO CUSTOMER
            const result = await CustomerService.createCustomer(customer);

            console.log('✅ Tạo thành công:', result);

            // // ✅ TỰ ĐỘNG ĐĂNG NHẬP
            // const loginRes = await AuthService.login(registerData.email.trim(), registerData.password.trim());

            // if (loginRes.success) {
            //     const { user, token } = loginRes.data;

            //     // ✅ LƯU USERSTORAGE
            //     userStorage.addUser({
            //         userId: user.makh || user.id,
            //         username: user.hoten || 'Khách hàng',
            //         token,
            //         email: user.email
            //     });

            //     alert('🎉 Đăng ký thành công!');
            //     router.push('/dashboard');
            // }
        } catch (error: any) {
            console.error('❌ Lỗi đăng ký:', error);
            setErrors({
                general: error.message?.includes('duplicate') ? 'Email đã tồn tại!' : error.message || 'Đăng ký thất bại'
            });
        } finally {
            setLoading(false);
        }
    }, [registerData, validateRegister, router]);

    // ✅ LOGIN HANDLER
    const handleLogin = useCallback(async () => {
        setLoading(true);
        setErrors({});

        try {
            const result = await AuthService.login(loginData.email.trim(), loginData.password.trim());

            if (result.success) {
                const { user, token } = result.data;

                userStorage.addUser({
                    userId: user.makh || user.id,
                    username: user.hoten,
                    token,
                    email: loginData.email
                });

                router.push('/dashboard');
            } else {
                setErrors({ general: 'Email hoặc mật khẩu không đúng!' });
            }
        } catch (error: any) {
            setErrors({ general: 'Lỗi kết nối server!' });
        } finally {
            setLoading(false);
        }
    }, [loginData, router]);

    // ✅ TOGGLE FORM
    const toggleForm = () => {
        setIsRegister(!isRegister);
        setErrors({});
        setLoading(false);
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />

                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        {/* ✅ HEADER */}
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">{isRegister ? '👤 Đăng ký' : '👋 Đăng nhập'}</div>
                            <span className="text-600 font-medium">{isRegister ? 'Nhập Email & Mật khẩu' : 'Đăng nhập để tiếp tục'}</span>
                        </div>

                        {/* ✅ ERROR MESSAGES */}
                        {errors.general && <Message severity="error" text={errors.general} className="mb-4 w-full" />}

                        {/* ✅ REGISTER FORM - CHỈ 3 TRƯỜNG */}
                        {isRegister && (
                            <>
                                {/* EMAIL */}
                                <div className="field mb-5">
                                    <label htmlFor="email" className="block text-900 text-lg font-medium mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <InputText
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        className={classNames('w-full md:w-30rem mb-3', {
                                            'p-invalid': errors.email
                                        })}
                                        style={{ padding: '1rem' }}
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                                    />
                                    {errors.email && <small className="p-error block">{errors.email}</small>}
                                </div>

                                {/* PASSWORD */}
                                <div className="field mb-5">
                                    <label htmlFor="password" className="block text-900 text-lg font-medium mb-2">
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <Password
                                        inputId="password"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                                        placeholder="Mật khẩu (≥6 ký tự)"
                                        toggleMask
                                        className={classNames('w-full mb-3 md:w-30rem', {
                                            'p-invalid': errors.password
                                        })}
                                        inputClassName="w-full p-3"
                                        feedback={false}
                                    />
                                    {errors.password && <small className="p-error block">{errors.password}</small>}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="field mb-5">
                                    <label htmlFor="confirmPassword" className="block text-900 text-lg font-medium mb-2">
                                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <Password
                                        inputId="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                        placeholder="Nhập lại mật khẩu"
                                        toggleMask
                                        className={classNames('w-full mb-3 md:w-30rem', {
                                            'p-invalid': errors.confirmPassword
                                        })}
                                        inputClassName="w-full p-3"
                                        feedback={false}
                                    />
                                    {errors.confirmPassword && <small className="p-error block">{errors.confirmPassword}</small>}
                                </div>

                                {/* INFO: Họ tên mặc định */}
                                <div className="p-3 bg-blue-50 border-round mb-5 text-center">
                                    <small className="text-blue-600 font-medium">👤 Họ tên sẽ được đặt mặc định là "Khách hàng". Bạn có thể chỉnh sửa sau khi đăng nhập.</small>
                                </div>
                            </>
                        )}

                        {/* ✅ LOGIN FORM - CHỈ 2 TRƯỜNG */}
                        {!isRegister && (
                            <>
                                <div className="field mb-5">
                                    <label htmlFor="loginEmail" className="block text-900 text-xl font-medium mb-2">
                                        Email
                                    </label>
                                    <InputText
                                        id="loginEmail"
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full md:w-30rem mb-5"
                                        style={{ padding: '1rem' }}
                                        value={loginData.email}
                                        onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>

                                <div className="field mb-5">
                                    <label htmlFor="loginPassword" className="block text-900 font-medium text-xl mb-2">
                                        Password
                                    </label>
                                    <Password
                                        inputId="loginPassword"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                                        placeholder="Password"
                                        toggleMask
                                        className="w-full mb-5"
                                        inputClassName="w-full p-3 md:w-30rem"
                                    />
                                </div>
                            </>
                        )}

                        {/* ✅ REMEMBER ME (chỉ login) */}
                        {!isRegister && (
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2" disabled={loading} />
                                    <label htmlFor="rememberme1" className="cursor-pointer select-none">
                                        Remember me
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* ✅ SUBMIT BUTTON */}
                        <Button
                            label={loading ? (isRegister ? '⏳ Đang đăng ký...' : '⏳ Đang đăng nhập...') : isRegister ? '👤 Đăng ký' : 'Sign In'}
                            className="w-full p-3 text-xl mb-3"
                            onClick={isRegister ? handleRegister : handleLogin}
                            loading={loading}
                            disabled={loading}
                            icon={loading ? 'pi pi-spin pi-spinner' : undefined}
                        />

                        {/* ✅ TOGGLE BUTTON */}
                        <div className="text-center">
                            <Button
                                label={isRegister ? '👁️ Đã có tài khoản? Đăng nhập' : '👤 Chưa có tài khoản? Đăng ký'}
                                className="p-3 w-full text-primary border-primary bg-transparent"
                                text
                                onClick={toggleForm}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
