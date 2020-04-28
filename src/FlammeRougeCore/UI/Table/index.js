import styled from "styled-components";

const DEFAULT_BORDER = 1;

export default styled.div`
  display: table;
  border: ${DEFAULT_BORDER}px solid gray;
`;

export const Row = styled.div`
  display: table-row;
`;

export const Cell = styled.div`
  display: table-cell;
  line-height: ${props => props.cellRadius}px;
  height: ${props => props.cellRadius}px;
  width: ${props => props.cellRadius}px;
  text-align: center;
  border: ${DEFAULT_BORDER}px solid gray;
`;

export const DoubleCell = styled.div`
  display: table-cell;
  line-height: ${props => 2 * props.cellRadius}px;
  height: ${props => 2 * props.cellRadius}px;
  width: ${props => props.cellRadius}px;
  text-align: center;
  border: ${DEFAULT_BORDER}px solid gray;
`;
