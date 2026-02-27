import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],      
    http_req_duration: ["p(95)<500"],  
  },
};

const BASE_URL = "http://localhost:8090/api/loans";

export default function () {
  const workerRut = "11111111-1"; 
  const clientId = Math.floor(Math.random() * 100) + 1; 
  
  const toolId = Math.floor(Math.random() * 100) + 1;
  
  const params = { headers: { 'Content-Type': 'application/json' } };

  const loanPayload = JSON.stringify({
  tool: { id: toolId },
  client: { id: clientId }, 
  startDate: "2026-02-26",
  scheduledReturnDate: "2026-03-05",
  createdLoan: new Date().toISOString() 
});

  // 1. Probar createLoan (@PostMapping("/{rut}"))
  let resCreate = http.post(`${BASE_URL}/createLoan/${workerRut}`, loanPayload, params);

  let checkCreate = check(resCreate, {
    "E2: createLoan - OK (200)": (r) => r.status === 200,
  });

  if (checkCreate) {
    const loanId = resCreate.json().id;
    sleep(1); 

    const returnUrl = `${BASE_URL}/returnLoan/${loanId}/${workerRut}?damaged=false&irreparable=false`;
    let resReturn = http.post(returnUrl);

    check(resReturn, {
      "E2: returnLoan - OK (200)": (r) => r.status === 200,
      "E2: Kardex registrado": (r) => r.status === 200 && r.json().loanStatus === "DEVUELTO",
    });
  }

  sleep(1);
}