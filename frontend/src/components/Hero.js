import React, { Component } from "react";
import "../styles/hero.css";
import { LinkContainer } from "react-router-bootstrap";

class Hero extends Component {
  render() {
    const { heading, paragraph, button } = this.props;
    return (
      <div class="heroOverlay" data-aos="fade-up" data-aos-once="true">
        <div className="container">
          <div className="row justify-content-center">
            <div class="heroCopy col-lg-8">
              <h1 className="h600" style={{ color: "#c21f1f" }}>
                {heading}
              </h1>
              <div className="overlay">
                <p>{paragraph}</p>
              </div>
              <a type="button" class="btn btn-outline-dark" href="/login">
                {button}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Hero;
