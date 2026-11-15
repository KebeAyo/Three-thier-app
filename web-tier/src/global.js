import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    background: #080d18;
    scroll-behavior: smooth;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    color: #eef3fb;
    background:
      radial-gradient(ellipse at 82% 0%, rgba(35, 101, 111, 0.17), transparent 34rem),
      #080d18;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  button, input {
    font: inherit;
  }

  button, a {
    -webkit-tap-highlight-color: transparent;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button:focus-visible, a:focus-visible, input:focus-visible {
    outline: 3px solid rgba(95, 220, 192, 0.8);
    outline-offset: 3px;
  }

  img {
    display: block;
    max-width: 100%;
  }
`
