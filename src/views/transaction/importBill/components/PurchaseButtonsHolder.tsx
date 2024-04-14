import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { BiPlus } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory } from "react-router";
import { useAppSelector } from "../../../../app/hooks";

interface IProps {
  actionType: string;
  addPurchase: () => void;
  updatePurchase: () => void;
  deletePurchase: () => void;
}

const PurchaseButtonsHolder = ({
  actionType,
  addPurchase,
  updatePurchase,
  deletePurchase,
}: IProps) => {
  const history = useHistory();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const closePage = () => {
    localStorage.removeItem("purProData");
    history.push("/import-bill");
  };

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "end", marginTop: 5 }}>
          {actionType === "add" ? (
            <>
              <Button
                variant="outlined"
                sx={{ marginLeft: 2 }}
                onClick={addPurchase}
                startIcon={<IoMdAdd />}
                color="success"
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{ marginLeft: 2 }}
                color="error"
                startIcon={<RiDeleteBack2Fill />}
                onClick={closePage}
              >
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{ marginLeft: 2 }}
                onClick={updatePurchase}
                color={"primary"}
              >
                <BiPlus /> Update
              </Button>
              {loginedUserRole.includes("IBDelete") ? (
                <Button
                  variant="outlined"
                  sx={{ marginLeft: 2 }}
                  onClick={deletePurchase}
                  color={"error"}
                >
                  <DeleteOutlineIcon /> Delete
                </Button>
              ) : (
                ""
              )}

              <Button
                variant="outlined"
                sx={{ marginLeft: 2 }}
                onClick={closePage}
                color={"error"}
                startIcon={<RiDeleteBack2Fill />}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default PurchaseButtonsHolder;
