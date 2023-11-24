const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const axios = require("axios");
const { response } = require("express");
// const IP = require("ip");

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/static',express.static(path.join(__dirname, '/static')))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  messageAlert = ''

  res.render("login", {  messageAlert  } );
})

app.post("/login", (req, res) => {
  let isAuth;

  let body = { username: req.body.username, password: req.body.password }
  console.log(req.body.username);
  console.log(req.body.password);

  doPostRequest("", body)
      .then(data =>
      {
        let path = "";
        let messageAlert = "";

        console.log(data);
        // console.log(IP.address());

        if(data.header.message !== "User Authenticated"){
          path = "login"
          if(data.header.message == "Invalid User"){
            messageAlert = "Credenciales inválidas. Intente nuevamente"
          }else if(data.header.message == "Invalid Request"){
            messageAlert = "Intente nuevamente"
          }
          res.render(path, {
            messageAlert
          } );
        }else{
          if(data.body.isAuthenticated){
            path = "permission"
        }
        }



        // doPostRequest("http://controller-ip:8080/init", {"ip":IP.address()})
        //    .then(data => {})
        //    .catch(err => console.log(err))

        res.render(path, {
        } );

      })
      .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Authentication Portal running on ${port}`);
})

async function doPostRequest(url, payload) {
  let res = await axios.post(url, payload);
  let data = res.data;
  return data;
}