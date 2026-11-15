import styled from 'styled-components';

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(10, 17, 29, 0.98);
  border-right: 1px solid rgba(173, 194, 216, 0.15);
  box-shadow: 20px 0 60px rgba(0, 0, 0, 0.35);
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: min(340px, 88vw);
  z-index: 10;
  transition: transform 0.3s ease-in-out;

  .menu-label {
    margin: 0 0 18px;
    color: #77869a;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  ul {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 13px;
    border: 1px solid transparent;
    border-radius: 9px;
    color: #dce5ef;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s linear;

    span {
      color: #6fd8bd;
      font-size: 10px;
      letter-spacing: 0.1em;
    }

    &:hover {
      border-color: rgba(111, 216, 189, 0.15);
      color: #72ddc1;
      background: rgba(67, 175, 151, 0.08);
    }
  }
`;