import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  top: 0;
  bottom: 0;
  display: flex;
  && > div {
    align-self: center;
    margin: 0 auto;
    color: #fff;
    width: 400px;
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
    cursor: pointer;
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
  && > div > input {
    text-align: center;
    margin: 12px auto;
    width: 300px;
    display: block;
    -webkit-appearance: none;
    outline: none;
    border: none;
    padding: 10px 16px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  && > div > h1 {
    text-align: center;
    margin: 0 auto;
  }
  background-color: #0d0d0d;
`;

export default class Home extends Component {
  copyToClipBoard = () => {
    var copyText = document.querySelector('#playlistURL');
    copyText.select();
    document.execCommand('copy');
  };

  render() {
    return (
      <Wrapper>
        <div>
          <h1>Share this link</h1>
          <input
            readOnly
            type="text"
            id="playlistURL"
            value={
              window.location.origin + '/playlist/' + this.props.match.params.id
            }
          />
          <button onClick={this.copyToClipBoard}>Copy to clipboard</button>
        </div>
      </Wrapper>
    );
  }
}
