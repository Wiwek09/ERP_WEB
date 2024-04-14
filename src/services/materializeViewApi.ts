import server from "../server/server";

export const getMonthApi = async () => {
  try {
    const res = await server.get(`/api/NepaliMonthAPI/GetNepaliDate/`);
    return res.data;
  } catch (error) {
    return -1;
  }
};
export const getMaterializedData = async (monthName: string, Name: string) => {
  try {
    const res = await server.get(
      `/api/MaterializedView/?Month=${monthName}&FinancialYear=${Name}`
    );
    return res.data;
  } catch (error) {
    return -1;
  }
};
