
import styled from 'styled-components';

export const StyledBurger = styled.button`
  position: fixed;
  top: 23px;
  right: max(calc((100vw - 1180px) / 2), 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(173, 194, 216, 0.2);
  border-radius: 10px;
  background: rgba(17, 26, 40, 0.88);
  cursor: pointer;
  padding: 0;
  z-index: 12;
  outline: none;

  span {
    width: 15px;
    height: 1.5px;
    background: #cbd6e3;
    border-radius: 2px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: center;

    :first-child {
      transform: ${({ open }) => open ? 'translateY(6.5px) rotate(45deg)' : 'none'};
    }

    :nth-child(2) {
      opacity: ${({ open }) => open ? '0' : '1'};
    }

    :nth-child(3) {
      transform: ${({ open }) => open ? 'translateY(-6.5px) rotate(-45deg)' : 'none'};
    }
  }
`;