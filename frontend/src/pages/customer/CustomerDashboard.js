import React, { useEffect } from "react";
import Header from "../../components/Header";
import Meta from "../../components/Meta";
import Menu from "../../components/MenuCustomer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";

import { useHistory } from "react-router-dom";

// page content
const pageTitle = "HalifaxFoodie - Customer Dashboard";
const pageDescription = "Welcome to Halifax Foodie";

function CustomerDashboard() {
  const history = useHistory();

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user"));
    const tokenObj = { token: userObj["stsTokenManager"]["accessToken"] };
    axios.post("/api/verifyToken", tokenObj).then((resp) => {
      console.log("valid token");
      if (resp.data.message !== "valid token") {
        Swal.fire({
          icon: "warning",
          title: "Token Expired. Login Again!!",
          showConfirmButton: false,
          timer: 1500,
        });
        history.push("/logout");
      }
    });
  }, []);
  if (!localStorage.getItem("authStatus")) {
    Swal.fire({
      icon: "error",
      title: "NOT LOGGED IN",
      showConfirmButton: false,
      timer: 1500,
    });
    history.push("/");
  }
  if (JSON.parse(localStorage.getItem("dynamoDbObj")).usertype !== "customer") {
    Swal.fire({
      icon: "error",
      title: "Insufficient Access!!!",
      showConfirmButton: false,
      timer: 1500,
    });
    history.push("/");
  }
  const tempPostsObj = [
    {
      _id: "nkY3CE7J0uWol4CgkE0N48hEGAC2",
      restaurantname: "Tawa Naan",
      title: "Welcome",
      message: "Enjoy our delicious food",
    },
    {
      _id: "ArVEzyS0UCZFm3bGnwRZbqTAeyD2",
      restaurantname: "Curry Grill",
      title: "t1",
      message: "Enjoy our delicious food",
    },
    {
      _id: "2",
      restaurantname: "Masala Adda",
      title: "t1",
      message: "Enjoy our delicious food",
    },
  ];

  function navigateToMenu(e, id) {
    history.push("/menu/" + id);
  }

  return (
    <div>
      <Meta title={pageTitle} />
      <Header
        // head={pageTitle}
        description="Restaurants"
        style={{ align: "left" }}
      />
      <Menu></Menu>
      <Container>
        <Row className="justify-content-md-center">
          {tempPostsObj.map((r) => (
            <Col xs lg="3" md="4">
              <Card className="mb-3" key={r._id} id={r._id}>
                <Card.Img
                  variant="top"
                  src="https://images.unsplash.com/photo-1493770348161-369560ae357d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                />
                <Card.Body>
                  <Card.Title>{r.restaurantname}</Card.Title>
                  <Card.Text>{r.message}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={(event) => navigateToMenu(event, r._id)}
                  >
                    Go to Restaurant's Menu
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default CustomerDashboard;
