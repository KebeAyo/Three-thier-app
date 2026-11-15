import React from 'react';
import { bool, func } from 'prop-types';
import { StyledMenu } from './Menu.styled';
import {
  Link
} from "react-router-dom";


const Menu = ({ open, setOpen, ...props }) => {
  
  const isHidden = open ? true : false;
  const tabIndex = isHidden ? 0 : -1;

  return (
    <StyledMenu open={open} aria-hidden={!isHidden} {...props}>
        <p className="menu-label">Navigation</p>
        <ul>
            <li>
              <Link to="/" tabIndex={tabIndex} onClick={() => setOpen(false)}>
                <span aria-hidden="true">01</span> Overview
              </Link>
            </li>
            <li>
              <Link to="/db" tabIndex={tabIndex} onClick={() => setOpen(false)}>
                <span aria-hidden="true">02</span> Database demo
              </Link>
            </li>
        </ul>
    </StyledMenu>
  );
}

Menu.propTypes = {
  open: bool.isRequired,
  setOpen: func.isRequired,
}

export default Menu;