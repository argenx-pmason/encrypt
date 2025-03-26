import React, { useEffect, useState } from "react";
import { encryptPassword } from "./utility";
import { Box, Button, TextField } from "@mui/material";

function App() {
  const { host } = window.location,
    urlPrefix = window.location.protocol + "//" + window.location.host,
    webDavPrefix = urlPrefix + "/lsaf/webdav/repo",
    queryParameters = new URLSearchParams(window.location.search),
    app = queryParameters.get("app") ? queryParameters.get("app") : null;
  let realhost;
  if (host.includes("sharepoint")) {
    realhost = "xarprod.ondemand.sas.com";
  } else if (host.includes("localhost")) {
    realhost = "xartest.ondemand.sas.com";
  } else {
    realhost = host;
  }
  const api = "https://" + realhost + "/lsaf/api",
    [message, setMessage] = useState(null),
    [username, setUsername] = useState(""),
    [userFullName, setUserFullName] = useState(""),
    [password, setPassword] = useState(""),
    [encryptedPassword, setEncryptedPassword] = useState(""),
    usersUrl =
      webDavPrefix +
      "/general/biostat/metadata/projects/folder_access_request.json",
    [userList, setUserList] = useState([]);

  // get default values from local storage
  useEffect(() => {
    const tempUsername = localStorage.getItem("username"),
      tempEncryptedPassword = localStorage.getItem("encryptedPassword");
    setUsername(tempUsername);
    setEncryptedPassword(tempEncryptedPassword);
    fetch(usersUrl) // folder_access_request.json
      .then((response) => response.json())
      .then((data) => {
        setUserList(data);
      });
  }, [usersUrl]);

  // lookup the user's full name
  useEffect(() => {
    if (userList === null) return;
    const matchingUsers = userList.filter(
      (r) =>
        r.userid === username &&
        ["prg", "prg+ba", "dm", "dm+ba"].includes(r.profile)
    );
    if (matchingUsers.length > 0) {
      localStorage.setItem("userFullName", matchingUsers[0].Name);
      setUserFullName(matchingUsers[0].Name);
    } else {
      setUserFullName("");
    }
    // eslint-disable-next-line
  }, [username]);

  return (
    <div className="App">
      <h3>
        We need your username & password in order to use the REST API for {api}
      </h3>
      <Box sx={{ backgroundColor: "#ef9a9a", padding: "10px" }}>
        You need to enter your username and password. Then press the Encrypt
        button. This should be done each time your change your password. The
        encrypted password is stored securely in your browser's local storage.
        Once it is encrypted successfully you can exit this page.
        <br />
        If you were sent here from another page, then encrypt your password and
        then return to that page and refresh it.
        <p />
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
        <TextField
          size="small"
          label="Full Name"
          value={userFullName}
          disabled
          sx={{ ml: "10px", width: "400px" }}
        />
        <p />
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            encryptPassword(
              api,
              username,
              password,
              setEncryptedPassword,
              setMessage,
              urlPrefix,
              app
            );
          }}
          sx={{ ml: "10px" }}
        >
          Encrypt & Save
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setUserFullName("");
            setUsername("");
            setPassword("");
            setEncryptedPassword("");
            localStorage.clear();
          }}
          sx={{ ml: "10px" }}
        >
          Clear Local Storage
        </Button>
        {encryptedPassword && (
          <TextField
            size="small"
            label="Encrypted Password stored in Local Storage"
            value={encryptedPassword}
            disabled
            sx={{ ml: "10px", width: "600px", flexGrow: 1 }}
          />
        )}
        <p />
        {message && <Box sx={{ backgroundColor: "yellow" }}> {message}</Box>}
      </Box>
    </div>
  );
}
export default App;
