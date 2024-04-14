import server from "../server/server";

const getAllBranch = async () => {
  const response = await server.get("/api/BranchAPI/");
  return response.data;
};
const getBranch = async (id: any) => {
  const response = await server.get(`/api/BranchAPI/${id}`);
  if (response.data === null) {
    throw "Invalid id";
  }
  return response.data;
};

const addBranch = async (data: any) => {
  const response = await server.post("/api/BranchAPI", data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
const updateBranch = async (id: any, data: any) => {
  const response = await server.put(`/api/BranchAPI/${id}`, data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
const deleteBranch = async (id: any) => {
  const response = await server.post(`/api/BranchAPI/?id=${id}`, { Id: id });
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
export { getAllBranch, getBranch, addBranch, updateBranch, deleteBranch };
