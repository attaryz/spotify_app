import React from "react";
import styled from "styled-components";

const StyledLoginContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoginButton = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-lg);
  padding: var(--spacing-sm) var(--spacing-xl);
  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;
const StyledLoginImage = styled.img`
  width: 50px;
  height: 50px;
  padding: 10px;
`;
const Login = () => (
  <StyledLoginContainer>
    <StyledLoginButton href="http://localhost:8888/login">
      Log in to Spotify
      <StyledLoginImage src="spotify.png" alt="" />
    </StyledLoginButton>
  </StyledLoginContainer>
);

export default Login;
