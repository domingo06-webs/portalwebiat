
// =============================================
// IAT PORTAL API
// Google Apps Script Backend
// Authentication: server-side session token
// =============================================

const API_URL =
    //'https://script.google.com/macros/s/AKfycbwG2s3ZeEa0NORzzJDSvCuhzL9j1ssahPFCNzCIeXMSE2jZP2riFnQTnbYawc6vT8YfWQ/exec';

const ADMIN_TOKEN_KEY = 'iat_admin_token';

function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

function saveAdminToken(token) {
    if (token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
}

// =============================================
// CORE REQUEST
// Backend doPost expects { action, data, token }
// =============================================

async function sendRequest(action, data = {}, options = {}) {
    const token = options.token !== undefined
        ? options.token
        : getAdminToken();

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
            action: action,
            data: data || {},
            token: token
        })
    });

    if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
    }

    const result = await response.json();

    if (!result.success) {
        if (/akses ditolak|session|sesi/i.test(result.message || '')) {
            saveAdminToken('');
        }

        throw new Error(result.message || 'Request gagal');
    }

    console.log('API RESPONSE [' + action + ']:', result);
    return result;
}

// =============================================
// ADMIN AUTHENTICATION
// =============================================

async function loginAdminToDatabase(password) {
    const result = await sendRequest(
        'loginAdmin',
        { password: password },
        { token: '' }
    );

    if (!result.token) {
        throw new Error(
            'Login berhasil tetapi token sesi tidak diterima.'
        );
    }

    saveAdminToken(result.token);
    return result;
}

async function checkAdminSessionWithServer() {
    const token = getAdminToken();

    if (!token) return false;

    try {
        const result = await sendRequest(
            'checkAdminSession',
            {},
            { token: token }
        );

        return result.success === true;

    } catch (error) {
        saveAdminToken('');
        return false;
    }
}

async function logoutAdminFromDatabase() {
    const token = getAdminToken();

    try {
        if (token) {
            await sendRequest(
                'logoutAdmin',
                {},
                { token: token }
            );
        }
    } finally {
        saveAdminToken('');
    }
}

// =============================================
// GET DATA
// doGet returns { success, data: apps, news: news }
// =============================================

async function getAppsFromDatabase() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message || 'Gagal mengambil data aplikasi'
        );
    }

    console.log('DATA DARI SPREADSHEET:', result.data);

    return result.data || [];
}

async function getNewsFromDatabase() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message || 'Gagal mengambil data news'
        );
    }

    return result.news || [];
}

// =============================================
// APPS CRUD
// =============================================

async function addAppToDatabase(app) {
    return sendRequest('addApp', app);
}

async function updateAppToDatabase(app) {
    return sendRequest('updateApp', app);
}

async function deleteAppFromDatabase(id) {
    return sendRequest('deleteApp', { id: id });
}

// =============================================
// NEWS CRUD
// =============================================

async function addNewsToDatabase(news) {
    return sendRequest('addNews', news);
}

async function updateNewsToDatabase(news) {
    return sendRequest('updateNews', news);
}

async function deleteNewsFromDatabase(id) {
    return sendRequest('deleteNews', { id: id });
}
