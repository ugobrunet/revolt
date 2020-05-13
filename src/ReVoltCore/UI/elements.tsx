import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: ${(props: {
    left?: any;
    right?: any;
    center?: any;
    spaceBetween?: any;
    spaceAround?: any;
    column?: any;
    alignItems?: any;
  }) =>
    props.left
      ? "flex-start"
      : props.right
      ? "flex-end"
      : props.center
      ? "center"
      : props.spaceBetween
      ? "space-between"
      : props.spaceAround
      ? "space-around"
      : "none"};
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  ${(props) =>
    props.alignItems &&
    css`
      align-items: ${props.alignItems};
    `};
`;

export const Item = styled.div`
  flex: ${(props: { flex?: any; center?: any }) => props.flex || "none"};
  ${(props) =>
    props.center &&
    css`
      margin: 0 auto;
    `};
`;

export const DetachedItem = styled(Item)`
  /* Bottom margin from board */
  margin-bottom: 24px;
`;
