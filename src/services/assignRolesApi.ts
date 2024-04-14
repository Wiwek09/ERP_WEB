import server from "../server/server";

const getAssignRoles = async () => {
  const res = await server.get(`/api/UserAccountAPI/GetUsers/`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};
const getAssignRole = async (id: string) => {
  const res = await server.get(`/api/UserAccountAPI/GetUser/?id=${id}`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

const updateAssignRole = async (id: string, roleId: string) => {
  const res = await server.post(
    `/api/UserRoleAssign/?UserId=${id}&RoleId=${roleId}`
  );
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export { getAssignRoles, getAssignRole, updateAssignRole };
