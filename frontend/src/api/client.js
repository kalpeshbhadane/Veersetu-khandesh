const BASE = ""; // same-origin in dev (via Vite proxy) and in a same-domain production deploy

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: "include",
    headers: options.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  postForm: (path, formData) => request(path, { method: "POST", body: formData }),
};

// Spring Security's default formLogin endpoint expects
// application/x-www-form-urlencoded, not JSON — handled separately here.
export async function login(email, password) {
  const body = new URLSearchParams({ email, password });
  const res = await fetch(BASE + "/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.message) || "Login failed.");
  return data; // { email, role }
}

export async function logout() {
  await fetch(BASE + "/api/auth/logout", { method: "POST", credentials: "include" });
}

export function buildFileUrl(path) {
  if (!path) return null;
  return path; // backend paths already look like /uploads/photos/xyz.jpg, proxied in dev
}
