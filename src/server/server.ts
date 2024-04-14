import axios from "axios";
import Domain from "../domain";

const BASE_URL = Domain.domainName;

const server = axios.create({
  baseURL: BASE_URL,
});
export default server;
