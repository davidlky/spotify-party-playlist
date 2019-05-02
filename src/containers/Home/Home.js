import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  position: fixed;
  top: 0;
  bottom: 0;
  && > div {
    align-self: center;
    margin: 0 auto;
    color: #fff;
  }
  && > div > button {
    padding: 12px 24px;
    background: #648f00;
    color: #fff;
    font-size: 14px;
    border: none;
    border-radius: 26px;
    display: flex;
    margin: 0 auto;
    text-transform: uppercase;
    font-weight: 600;
    transition: 0.3s all;
  }
  && > div > button:focus,
  && > div > button:hover,
  && > div > button:active {
    background: #446f00;
    outline: none;
  }
  && > div > button > i {
    margin-right: 12px;
    font-size: 18px;
  }
  && > div > p {
    text-align: center;
    margin: 0 auto;
    max-width: 140px;
    letter-spacing: 0.08em;
    line-height: 1.6;
    margin-bottom: 44px;
  }
  background-color: #0d0d0d;
`;

export default class Home extends Component {
  goToLogin = () => {
    console.log(process.env);
    window.location.assign(process.env.REACT_APP_SERVER_URL + 'create/login');
  };
  render() {
    return (
      <Wrapper>
        <div>
          <p>Login to Spotify to create a new shared playlist.</p>
          <button onClick={() => this.goToLogin()}>
            <i className="fab fa-spotify" /> Log in with Spotify
          </button>
        </div>
      </Wrapper>
    );
  }
}
