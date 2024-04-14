import { styled } from "@mui/system";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: blue;
  display: flex;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;
export default StyledLink;
