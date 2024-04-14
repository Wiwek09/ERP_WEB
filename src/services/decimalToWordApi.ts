//API to convert Decimal value to word
import server from "../server/server";

export const getDecimalInWord = async (amount: number) => {
    const response = await server.get(`api/DecimalToWordAPI/?Amount=${amount}`);
    return response.data;
  };