import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Meta from "../components/Meta";
import MenuRestaurant from "../components/MenuRestaurant";
import MenuCustomer from "../components/MenuCustomer";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Swal from "sweetalert2";
import { Alert } from "react-bootstrap";
import { firebaseAuthObj } from "../config/firebaseConfig";
import MenuBlank from "../components/MenuBlank";

// page content
const pageTitle = "Security Questions";
const pageDescription = "";

function SecurityQuestions() {
  const history = useHistory();
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState("");
  const [dynamoDbUserObj, setdyanmoDBUserObj] = useState();
  const userObj = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!userObj) {
      Swal.fire({
        icon: "error",
        title: "NOT LOGGED IN",
        showConfirmButton: false,
        timer: 1500,
      });
      history.push("/");
    }
    const userId = { userid: userObj && userObj["uid"] };
    const api_url =
      "https://o0uw98zam6.execute-api.us-east-1.amazonaws.com/PROD/getUser";
    const conf = {
      headers: {
        "x-api-key": "YyFQfDqizX9CtCAt9onDv1U5LPlyy1WV285CYmBy",
        "content-type": "application/json",
      },
    };
    axios
      .post(api_url, userId, conf)
      .then((response) => {
        console.log(response);

        setdyanmoDBUserObj(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });

    const reqObj = {
      userid: userObj["uid"],
      question1: data.get("questionone"),
      question2: data.get("questiontwo"),
      answer1: data.get("answer1"),
      answer2: data.get("answer2"),
    };
    console.log(userObj);
    console.log(reqObj);
    const conftwo = {
      headers: {
        "x-api-key": "3h9i6Ml98j7cukjdjYcxG3cTD04IA2HU2s05Xy0b",
        "content-type": "application/json",
      },
    };
    const submitMFA = async () => {
      //loginaxios request to backend

      axios
        .post(
          "https://7os7qe21ji.execute-api.us-east-1.amazonaws.com/PROD/verifySecurityQuestions",
          reqObj,
          conftwo
        )
        .then((response) => {
          console.log(response);
          setSuccess("");
          setErrors("");
          Swal.fire({
            icon: "success",
            title: "Logged in",
            showConfirmButton: false,
            timer: 1500,
          });
          localStorage.setItem("authStatus", true);
          localStorage.setItem("dynamoDbObj", JSON.stringify(dynamoDbUserObj));
          const requestObject = { userid: userObj.uid };
          axios
            .put(
              "https://sjstcgbk8f.execute-api.us-east-1.amazonaws.com/PROD/setStatusOnline",
              requestObject
            )
            .then((res) => {
              if (dynamoDbUserObj && dynamoDbUserObj.usertype === "customer") {
                history.push("/customer/dashboard");
              } else {
                history.push("restaurant/dashboard");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
          setSuccess("");
          setErrors("Security check failed!! Check your responses!!");
          Swal.fire({
            icon: "warning",
            title: "Security check failed!! Check your responses!!",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    };

    submitMFA();
  };

  const displayErrors = () => {
    if (errors !== "") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      {console.table(JSON.parse(localStorage.getItem("user")))}
      <Meta title="HalifaxFoodie - MFA" />
      <Header head={pageTitle} description={pageDescription} />
      {/* {dynamoDbUserObj && dynamoDbUserObj.usertype === "customer" ? (
        <MenuCustomer></MenuCustomer>
      ) : (
        <MenuRestaurant></MenuRestaurant>
      )} */}
      <MenuBlank></MenuBlank>

      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="questionone">
                <Form.Label>
                  <b>Question 1.</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="questionone"
                  value={dynamoDbUserObj && dynamoDbUserObj.question1}
                />
              </Form.Group>
              <Form.Group controlId="answer1">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your response ..."
                  name="answer1"
                  required
                  minLength="2"
                />
              </Form.Group>
              <Form.Group controlId="questiontwo">
                <Form.Label>
                  <b>Question 2.</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="questiontwo"
                  value={dynamoDbUserObj && dynamoDbUserObj.question2}
                />
              </Form.Group>
              <Form.Group controlId="answer2">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your response ..."
                  name="answer2"
                  required
                  minLength="2"
                />
              </Form.Group>
              <br></br>
              {displayErrors() ? <Alert variant="danger">{errors}</Alert> : ""}
              {/* <Form.Group controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group> */}
              <br></br>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SecurityQuestions;
