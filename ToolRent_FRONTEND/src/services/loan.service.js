import httpClient from '../http-common';

const createLoan = (data, rut) => httpClient.post(`/api/loans/createLoan/${rut}`, data);

export const returnLoan = (loanId, rut, damaged = false, irreparable = false) =>
  httpClient.post(
    `/api/loans/returnLoan/${loanId}/${rut}?damaged=${damaged}&irreparable=${irreparable}`,
  );

export const getLoans = () => httpClient.get('/api/loans/getLoans');

export const getActiveLoans = () => httpClient.get('/api/loans/loansActive');

export const updateFinePaid = (loanId, finePaid) =>
  httpClient.put(`/api/loans/${loanId}/finePaid?finePaid=${finePaid}`);

export const getActiveLoansByDate = (startDate, endDate) =>
  httpClient.get(`/api/loans/loansActiveByDate?startDate=${startDate}&endDate=${endDate}`);

export const getOverdueLoans = () => httpClient.get('/api/loans/overdueClients');

export const getOverdueLoansByDate = (startDate, endDate) =>
  httpClient.get(
    `/api/loans/overdueClients/dateRange?startDate=${startDate}&endDate=${endDate}`,
  );

export const getTopToolsByDate = (startDate, endDate) =>
  httpClient.get(`/api/loans/topToolsByDate?startDate=${startDate}&endDate=${endDate}`);

export const getTopToolsAllTime = () => httpClient.get('/api/loans/topTools');

export const getUnpaidLoans = () => httpClient.get('/api/loans/unpaid');

export default {
  returnLoan,
  createLoan,
  getActiveLoans,
  getLoans,
  updateFinePaid,
  getActiveLoansByDate,
  getOverdueLoans,
  getOverdueLoansByDate,
  getTopToolsByDate,
  getTopToolsAllTime,
  getUnpaidLoans,
};