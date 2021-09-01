import React, { useEffect } from "react";

import axios from "axios";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { firebaseAuthObj } from "../config/firebaseConfig";

function Logout() {
  const history = useHistory();
  const userObj = JSON.parse(localStorage.getItem("user"));
  const reqObj = { userid: userObj.uid };

  useEffect(() => {
    axios
      .put(
        "https://98ym2iigda.execute-api.us-east-1.amazonaws.com/PROD/logOut",
        reqObj
      )
      .then((resp) => {
        localStorage.removeItem("authStatus");
        localStorage.removeItem("user");
        localStorage.removeItem("dynamoDbObj");
        firebaseAuthObj.signOut();
      })
      .catch((error) => {});

    history.push("/login");
  }, []);

  return <div></div>;
}

export default Logout;
