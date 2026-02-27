import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,           
  duration: '1m',    
  thresholds: {
    http_req_failed: ["rate<0.01"],      
    http_req_duration: ["p(95)<1500"], 
  },
};

const BASE_URL = "http://192.168.100.99:8090/api/loans";
const start = "2025-01-01";
const end = "2026-12-31";

export default function () {

  // 4. Reporte por Rango de Fecha: Activos
  let resActiveDate = http.get(`${BASE_URL}/loansActiveByDate?startDate=${start}&endDate=${end}`);
  check(resActiveDate, {
    "E6: Activos Fecha - status 200": (r) => r.status === 200,
    "E6: Activos Fecha - response is array": (r) => r.status === 200 && r.body && Array.isArray(r.json()),
  });

  // 5. Reporte por Rango de Fecha: Ranking
  let resTopDate = http.get(`${BASE_URL}/topToolsByDate?startDate=${start}&endDate=${end}`);
  check(resTopDate, {
    "E6: Ranking Fecha - status 200": (r) => r.status === 200,
    "E6: Ranking Fecha - response is array": (r) => r.status === 200 && r.body && Array.isArray(r.json()),
  });

  // 6. Reporte por Rango de Fecha: Atrasados
  let resOverdueRange = http.get(`${BASE_URL}/overdueClients/dateRange?startDate=${start}&endDate=${end}`);
  check(resOverdueRange, {
    "E6: Atrasados Rango - status 200": (r) => r.status === 200,
    "E6: Atrasados Rango - response is array": (r) => r.status === 200 && r.body && Array.isArray(r.json()),
  });

  sleep(1);
}