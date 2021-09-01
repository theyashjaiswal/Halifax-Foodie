import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Meta from "../../components/Meta";
import MenuCustomer from "../../components/MenuCustomer";
import MenuRestaurant from "../../components/MenuRestaurant";
import Menu from "../../components/Menu";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import { Interactions } from "aws-amplify";
import { useHistory } from "react-router-dom";

// page content
const pageTitle = "HalifaxFoodie - Support";
const pageDescription = "Welcome to Halifax Foodie";

function Support() {
  const history = useHistory();
  const dynamoDbUserObj = JSON.parse(localStorage.getItem("dynamoDbObj"));
  const textInput = React.useRef();
  const [state, setState] = useState({});
  let [chatMessages, setChatMessages] = useState([]);
  if (
    (JSON.parse(localStorage.getItem("dynamoDbObj")).usertype !==
      "restaurant") &
    (JSON.parse(localStorage.getItem("dynamoDbObj")).usertype !== "customer")
  ) {
    Swal.fire({
      icon: "error",
      title: "Insufficient Access!!!",
      showConfirmButton: false,
      timer: 1500,
    });
    history.push("/");
  }
  if (!localStorage.getItem("authStatus")) {
    Swal.fire({
      icon: "error",
      title: "NOT LOGGED IN",
      showConfirmButton: false,
      timer: 1500,
    });
    history.push("/");
  }
  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;

    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submitForm(event) {
    let userInput = state.messageToSend;
    chatMessages.push({
      type: "user",
      message: userInput,
    });
    let response = await Interactions.send("HalifaxFoodiesSupport", userInput);
    let temp = chatMessages;
    setChatMessages(temp);
    chatMessages.push({
      type: "system",
      message: response.message,
    });
    setState((prev) => ({
      ...prev,
    }));
    textInput.current.value = "";
  }

  return (
    <div>
      <Meta title={pageTitle} />
      {dynamoDbUserObj && dynamoDbUserObj.usertype === "customer" ? (
        <MenuCustomer></MenuCustomer>
      ) : (
        <MenuRestaurant></MenuRestaurant>
      )}
      <Container className="add-margin-top">
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <Card className="mb-3">
              <Card.Header>
                <p className="message-header">Talk to our online support</p>
              </Card.Header>
              <Card.Body>
                <div>
                  <div>
                    {chatMessages.map((message, index) =>
                      message.type == "user" ? (
                        <p className="user-text" key={index}>
                          {message.message}
                        </p>
                      ) : (
                        <p className="system-text" key={index}>
                          {message.message}
                        </p>
                      )
                    )}
                  </div>
                </div>
                <Form>
                  <Form.Group controlId="messageToSend">
                    <Form.Control
                      type="input"
                      name="messageToSend"
                      placeholder="Enter Message"
                      onChange={handleChange}
                      ref={textInput}
                      required
                    />
                  </Form.Group>
                  <Button
                    style={{ float: "right" }}
                    variant="primary"
                    onClick={submitForm}
                  >
                    Send
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Support;
