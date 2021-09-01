import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Meta from "../../components/Meta";
import MenuCustomer from "../../components/MenuCustomer";
import MenuRestaurant from "../../components/MenuRestaurant";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import { Interactions } from "aws-amplify";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

let chatMessages = [];

let onlineList = ["Vishal Parmar"];

// page content
const pageTitle = "HalifaxFoodie - Chat";
const pageDescription = "Welcome to Halifax Foodie";

function Chat() {
  const history = useHistory();
  const dynamoDbUserObj = JSON.parse(localStorage.getItem("dynamoDbObj"));
  const textInput = React.useRef();
  const [representative, setRepresentative] = useState("");
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
  useEffect(async () => {
    const ONLINE_USERS_API =
      "https://2l0tap227c.execute-api.us-east-1.amazonaws.com/PROD/getOnlineUsers";
    let data = await axios.get(ONLINE_USERS_API);
    if (data != undefined) {
      let onlineUsr = data.data;
      JSON.stringify(onlineUsr);
    }
  }, []);

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;

    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function selectRepresentative(event, data) {
    setRepresentative(data);
  }

  async function startChat(event) {
    if (representative != "") {
      let userMessage = state.messageToSend;
      chatMessages.push({
        type: "user1",
        message: userMessage,
      });
      let response = await Interactions.send("HalifaxFoodieChat", userMessage);
      setTimeout(function () {
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
      }, 3000);
    }
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
          <Col xs lg="9">
            <Card className="mb-3">
              <Card.Header>
                <p className="message-header">
                  Chat with our customer representative
                  {representative == "" ? (
                    <p>Please select the representative</p>
                  ) : (
                    <p> You are chatting with {representative}</p>
                  )}
                </p>
              </Card.Header>
              <Card.Body>
                <div>
                  {chatMessages.map((message, index) =>
                    message.type == "user1" ? (
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
                    onClick={startChat}
                  >
                    Send
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xs lg="3">
            <Card className="mb-3">
              <Card.Header>
                <p className="message-header">Online Representatives</p>
              </Card.Header>
              <Card.Body>
                <div>
                  {onlineList.map((person, index) => (
                    <p
                      key={index}
                      className="online-user"
                      onClick={(event) => selectRepresentative(event, person)}
                    >
                      {person}
                    </p>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Chat;
