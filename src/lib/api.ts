import { getToken, clearToken } from "./auth";

interface IAPIResponseBase {
    httpStatus: number;
    headers: Record<string, string>;
    message: string;
}

export type IAPIResponse<D> = IAPIResponseBase & (
    | {
        success: true;
        data: D;
    }
    | {
        success: false;
        data: null;
    }
);

export class APIError extends Error {
    httpStatus: number;
    headers: Record<string, string>;
    reason: string;

    constructor(data: IAPIResponse<unknown>) {
        super(`[HTTP API] Error! "${data.message}"`);
        this.httpStatus = data.httpStatus;
        this.headers = data.headers;
        this.reason = data.message;
    }
}

export async function requestAPI<D extends object>(options: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;           // ใส่แค่ "/news" ได้เลย
    baseURL?: string;      // เผื่ออยาก override เป็น url อื่น
    body?: unknown;
    query?: Record<string, string | number | boolean | null | undefined>;
    headers?: Record<string, string>;
    disableToken?: boolean;
    throwHTTPError?: boolean;
}): Promise<IAPIResponse<D>> {
    let body: BodyInit | null = null;

    const headers: HeadersInit = {
        ...options.headers,
    };
    const token = getToken();

    if (token && !options.disableToken) {
    headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body instanceof FormData) {
        body = options.body;
    } else if (options.body instanceof Object) {
        body = JSON.stringify(options.body);
        headers['content-type'] = 'application/json';
    }

    // ---------------------------------------------------------
    // ✅ จุดที่จัดการ URL ให้ฉลาดขึ้น (Smart URL Joining)
    // ---------------------------------------------------------
    // 1. ดึง Base URL จาก .env (ถ้าไม่มีให้เป็นว่าง)
    const apiBase = options.baseURL ?? import.meta.env.VITE_API_URL ?? ''; 
    
    let finalUrl = options.url;

    // 2. ถ้า URL ที่ส่งมา ไม่ได้เริ่มด้วย http (เช่นส่งมาแค่ /news)
    if (!options.url.startsWith('http')) {
        // ลบ / ท้าย apiBase ออก (ถ้ามี) เพื่อกัน / ซ้ำ
        const cleanBase = apiBase.replace(/\/+$/, '');
        // ลบ / หน้า url ออก (ถ้ามี)
        const cleanPath = options.url.replace(/^\/+/, '');
        
        // จับมาต่อกัน โดยมี / คั่นตรงกลางตัวเดียวเสมอ
        finalUrl = `${cleanBase}/${cleanPath}`;
    }

    // 3. ต่อ Query Params (ถ้ามี)
    if (options.query) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(options.query)) {
            params.append(key, String(value));
        }
        finalUrl += `?${params.toString()}`;
    }
    // ---------------------------------------------------------

    try {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), 12_000);

        // console.log("🚀 กำลังยิงไปที่:", finalUrl); // เปิดบรรทัดนี้เพื่อ Debug ดู URL

        const resp = await fetch(finalUrl, {
            method: options.method,
            body: !['GET', 'DELETE'].includes(options.method) ? body || '' : undefined,
            // ⚠️ สำคัญ: ถ้า Backend ตั้ง Allow-Origin: * ต้องเปลี่ยนตรงนี้เป็น undefined หรือ 'omit'
            // แต่ถ้า Backend ระบุชื่อเว็บเราชัดเจนแล้ว ให้ใช้ 'include' ได้เลย (เพื่อส่ง Cookie)
            credentials:'omit', // ถา้าขึ้น prodaction ต้องเปลี่ยนเป็น include เพื่อให้ส่ง cookie ด้านความปลอดภัยไปด้วย
            headers: headers,
            signal
        });
        clearTimeout(timeoutId);

        // CRIT-01: token ถูกเพิกถอน/หมดอายุฝั่ง server (ปิดบัญชี/ลบ user/logout ทุกอุปกรณ์)
        // route guard ฝั่ง client เช็คแค่ exp จึงไม่รู้ → เมื่อ API ตอบ 401 ทั้งที่แนบ token มา
        // ให้เคลียร์ token แล้วเด้งไปหน้า login กันผู้ใช้ค้างในสภาพ zombie
        // ยกเว้น endpoint auth เอง (/login, /logout) และตอนอยู่หน้า login อยู่แล้ว (กัน redirect loop)
        if (resp.status === 401 && token && !options.disableToken) {
            const isAuthEndpoint = finalUrl.includes('/login') || finalUrl.includes('/logout');
            const path = window.location.pathname;
            if (!isAuthEndpoint && path.startsWith('/admin') && path !== '/admin/login') {
                clearToken();
                window.location.href = '/admin/login';
            }
        }

        const js = await resp.json();

        // ---------------------------------------------------------
        // ✅ จุดแกะข้อมูล (Unwrapping Data)
        // ---------------------------------------------------------
        // เช็คว่า backend ส่ง data มาซ้อน data หรือไม่
        const responseData = js.data !== undefined ? js.data : js;
        const responseMessage = js.message ?? (resp.ok ? 'Success' : 'Internal server error');

        const errorData: IAPIResponse<D> = {
            httpStatus: resp.status,
            success: resp.ok, // ยึดตาม HTTP Status 200 เป็นหลัก
            headers: Object.fromEntries(resp.headers ?? {}),
            message: responseMessage,
            data: responseData, 
        };

        if (!errorData.success && options.throwHTTPError)
            throw new APIError(errorData);

        return errorData;

    } catch (e) {
        console.error("API Error:", e);
        if (options.throwHTTPError) {
            if (e instanceof APIError) throw e;
            throw e;
        }

        return {
            httpStatus: 0,
            headers: {},
            success: false,
            message: e instanceof Error ? e.message : 'Connection timeout',
            data: null,
        } satisfies IAPIResponse<D>;
    }
}