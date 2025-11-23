import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: Number(__ENV.VUS || 5),
  duration: __ENV.DURATION || "1m",
};

const base = __ENV.API_BASE_URL;
const token = __ENV.TOKEN;

if (!base || !token) {
  throw new Error("Missing env: API_BASE_URL and TOKEN are required");
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

export default function () {
  // Create
  const createRes = http.post(`${base}/items`, JSON.stringify({ title: "k6", description: "load" }), { headers });
  check(createRes, { "create 201": (r) => r.status === 201 });
  const created = createRes.json();
  const id = created?.id;

  // Get
  const getRes = http.get(`${base}/items/${id}`, { headers });
  check(getRes, { "get 200": (r) => r.status === 200 });

  // List
  const listRes = http.get(`${base}/items`, { headers });
  check(listRes, { "list 200": (r) => r.status === 200 });

  // Update
  const updRes = http.put(`${base}/items/${id}`, JSON.stringify({ title: "k6-upd" }), { headers });
  check(updRes, { "update 200": (r) => r.status === 200 });

  // Delete
  const delRes = http.del(`${base}/items/${id}`, null, { headers });
  check(delRes, { "delete 200": (r) => r.status === 200 });

  sleep(1);
}



