import React, { useEffect, useState } from "react";
import { encryptPassword } from "./utility";
import { Box, Button, TextField } from "@mui/material";

function App() {
  const { host } = window.location;
  let realhost;
  if (host.includes("sharepoint")) {
    realhost = "xarprod.ondemand.sas.com";
  } else if (host.includes("localhost")) {
    realhost = "xartest.ondemand.sas.com";
  } else {
    realhost = host;
  }
  const api = "https://" + realhost + "/lsaf/api",
    [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [encryptedPassword, setEncryptedPassword] = useState("");

  // get default values from local storage
  useEffect(() => {
    const tempUsername = localStorage.getItem("username"),
      tempEncryptedPassword = localStorage.getItem("encryptedPassword");
    setUsername(tempUsername);
    setEncryptedPassword(tempEncryptedPassword);
  }, []);

  return (
    <div className="App">
      <h3>
        We need your username & password in order to use the REST API for {api}
      </h3>
      <Box sx={{ backgroundColor: "#ef9a9a", padding: "10px" }}>
        <TextField
          size="small"
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <TextField
          size="small"
          label="Password"
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          sx={{ ml: "10px" }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            encryptPassword(api, username, password, setEncryptedPassword)
          }
          sx={{ ml: "10px" }}
        >
          Encrypt Password if you havent already or if you changed the password
        </Button>
        {encryptedPassword && <p>{encryptedPassword}</p>}
        <p />
        Once it is encrypted successfully you can exit this page.
      </Box>
    </div>
  );
}
export default App;
