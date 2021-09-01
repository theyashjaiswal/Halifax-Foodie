import Meta from "../components/Meta";
import Hero from "../components/Hero";
import React, { Component } from "react";
import Header from "../components/Header";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import registerIllustration from "../images/undraw_my_app_re_gxtj.png";
import orderFoodIllustration from "../images/undraw_online_groceries_a02y.png";
import orderConfirmedIllustration from "../images/undraw_Confirmation_re_b6q5.png";
import dashboardIllustration from "../images/undraw_Data_trends_re_2cdy.png";

import featureIcon from "../images/star.png";
import Menu from "../components/Menu";
import MenuCustomer from "../components/MenuCustomer";
import MenuRestaurant from "../components/MenuRestaurant";
import ProfImage from "../images/IMG_6752.JPEG";
import ProfImage1 from "../images/user.jpeg";
import ProfImage2 from "../images/photo_vishal.jpeg";
import ProfImage3 from "../images/photo_yash.jpg";

const Home = () => {
  // page content
  const pageTitle = "HalifaxFoodie - Home";
  const pageDescription = "welcome to halifax foodie";
  const dynamoDbUserObj = JSON.parse(localStorage.getItem("dynamoDbObj"));
  return (
    <div>
      <Meta title={pageTitle} />
      {dynamoDbUserObj && dynamoDbUserObj.usertype === "customer" ? (
        <MenuCustomer></MenuCustomer>
      ) : dynamoDbUserObj ? (
        <MenuRestaurant></MenuRestaurant>
      ) : (
        <Menu></Menu>
      )}
      <Hero
        heading="HALIFAX FOODIE"
        paragraph="Food Delivery System"
        button="Login"
      />
      <Container>
        <Header head={"Features"} description={""} />
        <Row>
          <Col lg="6">
            <h2 className="mt-5">
              <span className="text-muted">Easy </span> on-boarding
            </h2>
            <p className="lead">
              Quickly Sign-up, Verify your Email, and Get Started
            </p>
          </Col>
          <Col lg="6">
            <Image fluid src={registerIllustration} />
          </Col>
        </Row>
        <Row>
          <Col lg="6" className="order-lg-2">
            <h2 className="mt-5">
              <span className="text-muted">Order</span> Food
            </h2>
            <p className="lead">
              Easily browse through different restaurant menus and Order
            </p>
          </Col>
          <Col lg="6" className="order-lg-1">
            <Image fluid src={orderFoodIllustration} />
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <h2 className="mt-5">
              <span className="text-muted">Chat</span> Support
            </h2>
            <p className="lead">
              24x7 Online Support and Easily talk to our representatives via
              chat
            </p>
          </Col>
          <Col lg="6">
            <Image fluid src={orderConfirmedIllustration} />
          </Col>
        </Row>
        <Row>
          <Col lg="6" className="order-lg-2">
            <h2 className="mt-5">
              <span className="text-muted">Advanced</span> Restaurant Dashboard
            </h2>
            <p className="lead">
              Powerful Analytics, Word Cloud, and AI Based food tagging.
            </p>
          </Col>
          <Col lg="6" className="order-lg-1">
            <Image fluid src={dashboardIllustration} alt="" />
          </Col>
        </Row>
      </Container>
      <hr />
      <Container>
        <Header head={"Meet Our Team"} description={""} />
        <Row>
          <Col lg="6" className="text-center">
            <Image
              fluid
              roundedCircle
              src={ProfImage}
              style={{ width: "160px", height: "160px" }}
            />
            <h3>Aeshna Verma</h3>
            <p>Developer</p>
          </Col>
          <Col lg="6" className="text-center">
            <Image
              fluid
              roundedCircle
              src="https://ca.slack-edge.com/T01HYU7H2AE-U020HL03TLN-471b11138199-512"
              style={{ width: "160px", height: "160px" }}
            />
            <h3>Vishal Parmar</h3>
            <p>Developer</p>
          </Col>
          <Col lg="6" className="text-center">
            <Image
              fluid
              roundedCircle
              src={ProfImage2}
              style={{ width: "160px", height: "160px" }}
            />
            <h3>Vishal Sancheti</h3>
            <p>Developer</p>
          </Col>
          <Col lg="6" className="text-center">
            <Image
              fluid
              roundedCircle
              src={ProfImage3}
              style={{ width: "160px", height: "160px" }}
            />
            <h3>Yash Jaiswal</h3>
            <p>Developer</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
