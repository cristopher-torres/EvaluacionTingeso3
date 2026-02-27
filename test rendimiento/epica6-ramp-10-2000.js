import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 500 },
    { duration: '30s', target: 1000 },
    { duration: '30s', target: 2000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],      
    http_req_duration: ["p(95)<500"],  
  },
};

const BASE_URL = "http://192.168.100.99:8090/api/loans";
const start = "2025-01-01";
const end = "2026-12-31";

export default function () {

  // 4. Reporte por fechas: Activos
  let resActiveDate = http.get(`${BASE_URL}/loansActiveByDate?startDate=${start}&endDate=${end}`);
  check(resActiveDate, {
    "E6: Activos  - status 200": (r) => r.status === 200,
    "E6: Activos  - response is array": (r) => Array.isArray(r.json()),
  });

  // 5. Reporte por fechas: Ranking
  let resTopDate = http.get(`${BASE_URL}/topToolsByDate?startDate=${start}&endDate=${end}`);
  check(resTopDate, {
    "E6: Ranking  - status 200": (r) => r.status === 200,
    "E6: Ranking  - response is array": (r) => Array.isArray(r.json()),
  });

  // 6. Reporte por fechas: Atrasados
  let resOverdueRange = http.get(`${BASE_URL}/overdueClients/dateRange?startDate=${start}&endDate=${end}`);
  check(resOverdueRange, {
    "E6: Atrasados  - status 200": (r) => r.status === 200,
    "E6: Atrasados  - response is array": (r) => Array.isArray(r.json()),
  });

  sleep(1);
}