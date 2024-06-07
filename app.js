const mongoose = require("mongoose");
// mongoose.set('strictQuery', false);
const express = require("express");
const app = express();
const path = require("path");
// const pageRouter = require('./routes/routes');
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
dotenv.config({ path: "./config-secured.env" });
const flash = require("connect-flash");
var i18n = require("i18n-express");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var urlencodeParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodeParser);
const nodemailer = require("nodemailer");

const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(upload());

app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "nodedemo",
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
  })
);
app.use(cookieParser());

app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(flash());

// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(__dirname + "/scripts"));
// app.use(express.static(__dirname + '/utils'));

/* --------- Database connections ---------- */

//new
// const MongoDb = require("./dbStrings");
// MongoDb();

// mongoose.connect("mongodb://localhost:27017/EmailSystem", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const MongoDb = async () => {
  try {
    const con = await mongoose.connect("mongodb://localhost:27017/EmailSystem");
    console.log("mongodb connected successfuly");
  } catch (err) {
    console.log(err);
  }
};
MongoDb();
// MongoDb.on("connected", () => {
//   console.log("MongoDB connected successfully");
// });

// MongoDb();
// const mongoSecuredDBConnection = require("./dbStrings-secured");
// mongoSecuredDBConnection.on("connected", () => {
//   console.log("MongoDB *Secured connected successfully");
// });

//new
// const { crypyDB, inboxDB } = require("./dbStrings-secured");

// i18 use - Languages:
app.use(
  i18n({
    translationsPath: path.join(__dirname, "i18n"),
    siteLangs: ["ar", "ch", "en", "fr", "ru", "it", "gr", "sp"],
    textsVarName: "translation",
  })
);

const cors = require("cors");
app.use(cors());

// Routes:
// pageRouter(app);

// const authRoutes = require("./routes/authRoutes");
// app.use("/auth", authRoutes);

//new
// const dashboardRoutes = require("./routes/dashboardRoutes");
// app.use("/", dashboardRoutes);

//new
// const securedRoutes = require("./routes/securedRoutes");
// app.use("/", securedRoutes);

const inboxRoutes = require("./routes/inboxRoutes");
app.use("/", inboxRoutes);

const taskRoutes = require("./routes/task-managerRoutes");
app.use("/", taskRoutes);

// const crypyRoutes = require("./routes/crypy-piesRoutes");
// // app.use("/", crypyRoutes);

// const teamRoutes = require("./routes/teamRoutes");
// app.use("/", teamRoutes);

// const guideRoutes = require("./routes/guide-centerRoutes");
// app.use("/", guideRoutes);

// const settingsRoutes = require("./routes/settingsRoutes");
// app.use("/", settingsRoutes);

// const route = require("./routes/routes");
// app.use("/", route);

// app.all("*", function (req, res) {
//   res.locals = { title: "Error 404" };
//   res.render("auth/auth-404", {
//     page_title: "Error 404",
//     layout: "layouts/layout-without-nav",
//   });
// });

// app.all("*", function (req, res) {
//   res.locals = { title: "Error 404" };
//   res.render("inbox/emails", {
//     page_title: "Inbox",
//     layout: "layouts/layout-without-nav",
//   });
// });

app.get("/get-emails", (req, res) => {
  const { domain } = req.query;
  const emails = getEmailsForDomain(domain);
  res.json(emails);
});

function getEmailsForDomain(domain) {
  return ["email1@example.com", "email2@example.com"];
}

const http = require("http").createServer(app);
http.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
