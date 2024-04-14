import ExcelPurchaseOrder from "./components/ExcelTable";
import TableComponentPurchaseOrder from "./components/tableComponent";

const PurchaseOrder = () => {
  return (
    <>
      <TableComponentPurchaseOrder />
      <ExcelPurchaseOrder />
    </>
  );
};

export default PurchaseOrder;
