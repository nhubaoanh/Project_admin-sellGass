export interface UserStorageItem {
    userId: number;
    username: string;
    token: string;
    email?: string;
    role?: string;
    avatar?: string;
}

export const userStorage = {
    // 🔹 Lấy toàn bộ user đã lưu
    getAllUsers(): UserStorageItem[] {
        if (typeof window === 'undefined') return [];
        const json = localStorage.getItem('users');
        return json ? JSON.parse(json) : [];
    },

    // 🔹 Thêm hoặc cập nhật user
    addUser(user: UserStorageItem) {
        if (typeof window === 'undefined') return;

        const users = this.getAllUsers();
        const existing = users.find((u) => u.userId === user.userId);

        if (existing) {
            Object.assign(existing, user); // cập nhật token, username, ...
        } else {
            users.push(user);
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUserId', String(user.userId));
    },

    // 🔹 Lấy user hiện tại (đang đăng nhập)
    getCurrentUser(): UserStorageItem | null {
        if (typeof window === 'undefined') return null;
        const currentUserId = localStorage.getItem('currentUserId');
        if (!currentUserId) return null;

        const users = this.getAllUsers();
        return users.find((u) => u.userId === Number(currentUserId)) || null;
    },

    // 🔹 Lấy token của user hiện tại
    getCurrentToken(): string | null {
        const user = this.getCurrentUser();
        return user ? user.token : null;
    },

    // 🔹 Chuyển tài khoản
    switchUser(userId: number) {
        if (typeof window === 'undefined') return;
        const users = this.getAllUsers();
        const found = users.find((u) => u.userId === userId);
        if (!found) throw new Error('Không tìm thấy user để chuyển!');
        localStorage.setItem('currentUserId', String(userId));
    },

    // 🔹 Đăng xuất (chỉ xóa trạng thái đăng nhập)
    logout() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('currentUserId');
    },

    // 🔹 Xóa 1 user
    // removeUser(userId: number) {
    //     if (typeof window === 'undefined') return;
    //     const users = this.getAllUsers().filter((u) => u.userId !== userId);
    //     localStorage.setItem('users', JSON.stringify(users));

    //     const currentUserId = localStorage.getItem('currentUserId');
    //     if (currentUserId && Number(currentUserId) === userId) {
    //         localStorage.removeItem('currentUserId');
    //     }
    // },
    removeUser(userId: number) {
    if (typeof window === 'undefined') return;
    const users = this.getAllUsers().filter((u) => u.userId !== userId);
    localStorage.setItem('users', JSON.stringify(users));

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserIdNumber = currentUserId ? Number(currentUserId) : null;
    if (currentUserIdNumber !== null && currentUserIdNumber === userId) {
        localStorage.removeItem('currentUserId');
    }
},

    // 🔹 Xóa toàn bộ dữ liệu (reset)
    clearAll() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('users');
        localStorage.removeItem('currentUserId');
    }
};
