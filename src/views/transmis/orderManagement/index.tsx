import ExcelOrderManagement from "./components/ExcelTable";
import TableComponentOrderManagement from "./components/tableComponent";

const OrderManagement = () => {
  return (
    <>
      <TableComponentOrderManagement />
      <ExcelOrderManagement />
    </>
  );
};

export default OrderManagement;
