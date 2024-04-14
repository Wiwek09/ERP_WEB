import { Paper, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect } from "react";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { useHistory } from "react-router";

const StyledButton: any = styled(Button)`
  text-decoration: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 400;
  margin-top: 20px;
`;

const StyledPaper: any = styled(Paper)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 115px);
`;

const PageNotFound = () => {
  const history = useHistory();

  return (
    <>
      <StyledPaper>
        <Typography variant="h4">404 Error ! OOPS Page Not Found</Typography>

        <StyledButton
          onClick={() => history.goBack()}
          variant="outlined"
          startIcon={<BsFillArrowLeftSquareFill />}
        >
          GoBack
        </StyledButton>
      </StyledPaper>
    </>
  );
};

export default PageNotFound;
