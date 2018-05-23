const express = require("express");
const app = express();
const dinosaurs = require("./dinosaurs");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const PORT = process.env.PORT || 5678;
app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get("/dinosaurs", (request, response) => {
  response.render('index',{
    dinosaurs: dinosaurs,
  })
})


app.get("/dinosaurs/:id", (request, response) => {
  const x = request.params.id;
  response.render('show', {
    dinosaur: dinosaurs[x],
  });
})

const getNextKey = object => {
  let index = 1;
  // debugger;
  while (index in object) {
    index++;
  }
  return index;
};

app.post("/dinosaurs", (request, response) => {
  console.log(request.body);
  const index = getNextKey(dinosaurs);
  if (!request.body.name || !request.body.image_url) {
    response
      .status(400)
      .send(
        "A dinosaur needs a name and an image_url passed in the request body."
      );
    return;
  }
  dinosaurs[index] = {
    name: request.body.name,
    image_url: request.body.image_url
  };
  response.status(201).send(index.toString());
});


app.put("/dinosaurs/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!id in dinosaurs) {
    response.status(404).send("There is no dinosaur with id " + id.toString());
    return;
  }

  if (request.body.name) {
    dinosaurs[id].name = request.body.name;
  }

  if (request.body.image_url) {
    dinosaurs[id].image_url = request.body.image_url;
  }

  response.status(200).send();
});

app.delete("/dinosaurs/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!id in dinosaurs) {
    response.status(404).send("There is no dinosaur with id " + id.toString());
    return;
  }

  Reflect.deleteProperty(dinosaurs, id);
  response.send(200);
});

app.listen(5678, () => console.log("Example app listening on port 5678!"));
