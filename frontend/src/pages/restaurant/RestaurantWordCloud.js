import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Meta from "../../components/Meta";
import Menu from "../../components/MenuRestaurant";
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
import { Table } from "react-bootstrap";

const FormData = require("form-data");
const fs = require("fs");

// page content
const pageTitle = "HalifaxFoodie - Restaurant Analytics";
const pageDescription = "Welcome to Halifax Foodie";

function RestaurantWordCloud() {
  const history = useHistory();

  if (
    JSON.parse(localStorage.getItem("dynamoDbObj")).usertype !== "restaurant"
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
    const getWCURLUrl =
      "https:/serverless-hittgf4zcq-km.a.run.app/Feedback/GetWordCloudData";
    axios.get(getWCURLUrl).then((repos) => {
      const finalWDdata = repos.data;
      console.log("finalWordClouddata " + finalWDdata);

      var options = {
        method: "POST",
        url: "https://textvis-word-cloud-v1.p.rapidapi.com/v1/textToCloud",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key":
            "e431dd7fdfmshd3726113c399fe8p1e9deejsn79afd24059bc",
          "x-rapidapi-host": "textvis-word-cloud-v1.p.rapidapi.com",
        },
        data: {
          text: finalWDdata,
          scale: 1,
          width: 800,
          height: 600,
          colors: ["#375E97", "#FB6542", "#FFBB00", "#3F681C"],
          font: "Tahoma",
          use_stopwords: true,
          language: "en",
          uppercase: false,
        },
      };

      let responseWD = axios.request(options).then(function (response) {
        var textWD = response.data;
        var img = document.getElementById("wordCloud");
        img.src = textWD;
        img.height = 800;
        img.width = 600;
      });
    });
  }, []);

  return (
    <div>
      <Meta title={pageTitle} />
      <Header head="Word Cloud" description="" style={{ align: "left" }} />

      <Menu />
      <Container>
        <Row className="justify-content-md-center">
          <Col className="text-center">
            <Card className="mb-3">
              <Card.Body>
                <div>{useEffect.responseWD}</div>
                <img id="wordCloud" />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantWordCloud;
