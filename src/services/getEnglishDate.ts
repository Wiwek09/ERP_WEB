import server from "../server/server";

export const getEnglishDate = async (Ndate: string) => {
  const response = await server.get(
    `/api/NepaliMonthAPI/NepaliMonthAPI/?NDate=${Ndate}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const getNepaliDate = async (Ndate: string) => {
  const response = await server.get(
    `/api/NepaliMonthAPI/NepaliMonthAPI/?NDate=${Ndate}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
