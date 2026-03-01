import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '15s', target: 50 },
    { duration: '15s', target: 100 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],      
  },
};

const BASE_URL = "http://localhost:8090/api/loans";

export default function () {
  const workerRut = "11111111-1"; 
  const clientId = Math.floor(Math.random() * 100) + 101; 
  
  const toolId = Math.floor(Math.random() * 100) + 101;
  
  const params = { headers: { 'Content-Type': 'application/json' } };

  const loanPayload = JSON.stringify({
  tool: { id: toolId },
  client: { id: clientId }, 
  startDate: "2026-02-26",
  scheduledReturnDate: "2026-03-05",
  createdLoan: new Date().toISOString() 
});
  let resCreate = http.post(`${BASE_URL}/createLoan/${workerRut}`, loanPayload, params);

  const createOk = check(resCreate, {
    "Préstamo Creado": (r) => r.status === 200,
  });

  if (createOk) {
    const loanId = resCreate.json().id; 

    const returnUrl = `${BASE_URL}/returnLoan/${loanId}/${workerRut}?damaged=false&irreparable=false`;
    let resReturn = http.post(returnUrl);

    check(resReturn, {
      "Devolución Automática OK": (r) => r.status === 200,
      "Stock Liberado": (r) => r.json().loanStatus === "DEVUELTO",
    });
  }
}