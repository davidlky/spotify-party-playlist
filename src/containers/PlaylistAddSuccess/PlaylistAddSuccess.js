import React, { Component } from 'react';
import styled from 'styled-components';
import queryString from 'query-string';

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  overflow: auto;
  display: flex;
  top: 0;
  bottom: 0;
  && > div {
    align-self: center;
    margin: 0 auto;
    color: #fff;
  }
  && > div button {
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
    text-decoration: none;
  }
  && > div a {
    text-decoration: none;
  }
  && > div button:hover,
  && > div button:active {
    background: #446f00;
  }
  && > div button > i {
    margin-right: 12px;
    font-size: 18px;
  }
  && > div > p {
    color: #8e8a8a;
    text-align: center;
    max-width: 240px;
    margin: 0 auto;
    margin-top: 26px;
    font-weight: 300;
  }
  && > div > h3 {
    text-align: center;
    margin-bottom: 40px;
  }
  && div.list {
    max-width: 600px;
    margin-top: 40px;
  }
  && div.list > div {
    padding: 12px 16px;
    border-top: 0.05px solid #2d2d2d;
    display: flex;
  }
  && div.list > div:nth-last-child(1) {
    border-bottom: 0.05px solid #2d2d2d;
  }
  && div.list > div > p {
    padding: 0;
    margin: 0;
    font-size: 12px;
    font-weight: 300;
  }
  && div.list > div > p.label {
    width: 40px;
    color: #6d6969;
  }
  background-color: #0d0d0d;
`;
export default class PlaylistAddSuccess extends Component {
  render() {
    return (
      <Wrapper>
        <div>
          <h3>You're Done! Congratulations.</h3>
          <a
            href={`https://open.spotify.com/user/${
              queryString.parse(this.props.location.search).owner
            }/playlist/${this.props.match.params.id}`}
            target="_blank"
          >
            <button>Go to Playlist</button>
          </a>
          <p>Here are the songs we added to the public playlist</p>
          <div className="list">
            {queryString
              .parse(this.props.location.search)
              .songs.split('*')
              .map((el, i) => (
                <div>
                  <p className="label">{i + 1}.</p> <p>{el}</p>
                </div>
              ))}
          </div>
        </div>
      </Wrapper>
    );
  }
}
