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
  && > div > button:hover,
  && > div > button:focus,
  && > div > button:active {
    background: #446f00;
    outline: none;
  }
  && > div > button > i {
    margin-right: 12px;
    font-size: 18px;
  }
  && > div p {
    text-align: center;
    margin: 0 auto;
    max-width: 240px;
    letter-spacing: 0.08em;
    line-height: 1.6;
    margin-bottom: 44px;
  }
  background-color: #0d0d0d;
`;
export default class Home extends Component {
  state = {
    details: undefined,
  };
  async componentDidMount() {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}info/${this.props.match.params.id}`
      );
      if (!resp.ok) {
        this.setState({ details: new Error('Opps') });
      } else {
        const body = await resp.json();
        this.setState({ details: body });
      }
    } catch (e) {
      this.setState({ details: new Error('Opps') });
    }
  }

  goToLogin = () => {
    console.log(process.env);
    window.location.assign(
      process.env.REACT_APP_SERVER_URL +
        'playlist/login/' +
        this.props.match.params.id
    );
  };

  get detailsSection() {
    if (this.state.details instanceof Error) {
      return (
        <React.Fragment>
          <p>Invalid Playlist</p>
        </React.Fragment>
      );
    }
    if (this.state.details && this.state.details.users.length > 0) {
      return (
        <React.Fragment>
          <div>
            <p>
              Login to Spotify to add your top songs to{' '}
              <strong>{this.state.details.users[0].name}</strong>'s playlist.
            </p>
            <p>
              Who has joined the playlist:{' '}
              {this.state.details.users.map(el => el.name).join(', ')}
            </p>
          </div>
          <button onClick={() => this.goToLogin()}>
            <i className="fab fa-spotify" /> Log in with Spotify
          </button>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <p>Login to Spotify to add your top songs to the shared playlist.</p>
        <button onClick={() => this.goToLogin()}>
          <i className="fab fa-spotify" /> Log in with Spotify
        </button>
      </React.Fragment>
    );
  }
  render() {
    return (
      <Wrapper>
        <div>{this.detailsSection}</div>
      </Wrapper>
    );
  }
}
