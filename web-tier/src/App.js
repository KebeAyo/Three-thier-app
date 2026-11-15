import React, { useState, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { useOnClickOutside } from './hooks';
import { GlobalStyles } from './global';
import { theme } from './theme';
import { Burger, Menu } from './components';
import FocusLock from 'react-focus-lock';
import DatabaseDemo from './components/DatabaseDemo/DatabaseDemo';
import Home from './components/Home/Home';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  const [open, setOpen] = useState(false);
  const node = useRef();
  const menuId = "main-menu";

  useOnClickOutside(node, () => setOpen(false));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <div className="app-shell" ref={node}>
          <FocusLock disabled={!open}>
            <header className="topbar">
              <a className="brand" href="#/">
                <span className="brand-mark" aria-hidden="true">3T</span>
                <span className="brand-copy">
                  <strong>THREE-TIER LAB</strong>
                  <span>Cloud architecture demo</span>
                </span>
              </a>
              <span className="topbar-status">
                <span className="status-dot" aria-hidden="true" />
                Application overview
              </span>
              <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
            </header>
            <Menu open={open} setOpen={setOpen} id={menuId} />
            <main className="page-content">
              <Switch>
                <Route path="/db">
                  <DatabaseDemo />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </main>
          </FocusLock>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
