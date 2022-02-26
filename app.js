const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Comp_student = require("./models/students");
const Attendance = require("./models/attendance");
const collectionName = 'Students'

mongoose
  .connect(`mongodb://localhost:27017/${collectionName}`, { useNewUrlParser: true })
  .then(() => {
    console.log("Connection open");
  })
  .catch((err) => {
    console.log("Oh no error");
    console.log(err);
  });

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const stu_data = await Comp_student.find({}).sort({ rollno: 1 });
  console.log(stu_data);

  res.render("index.ejs", { stu_data });
});

app.get("/attendance", async (req, res) => {
  const att_data = await Attendance.find({}).sort({"rollno":1});
  console.log(att_data);
  res.render("attendanceList.ejs", { att_data });
});

app.get("/attendance/addstudent", async (req, res) => {
  // const att_data = await Attendance.find({});
  res.render("createNew.ejs");
});

app.post("/attendance", async(req, res) => {
  // var dd = String(ex_date.getDate()).padStart(2, "0");
  // var mm = String(ex_date.getMonth() + 1).padStart(2, "0");
  // var yyyy = ex_date.getFullYear();
  // var today = dd + "/" + mm + "/" + yyyy;

  const newStudent = new Attendance(req.body)
  await newStudent.save()
  console.log(req.body);

  res.redirect('/attendance')
});

const ex_date = new Date();

var dd = String(ex_date.getDate()).padStart(2, "0");
var mm = String(ex_date.getMonth() + 1).padStart(2, "0");
var yyyy = ex_date.getFullYear();
var today = dd + "/" + mm + "/" + yyyy;

app.get("/attendance/:id", async (req, res) => {
  const { id } = req.params;
  const student = await Attendance.findById(id);
  res.render("individualList.ejs", { student });
});

app.get("/attendance/:id/addattendance", async (req, res) => {
  const { id } = req.params;
  const student = await Attendance.findById(id);
  for ( key in student){
    console.log(key)
  }
  res.render("addAttendance.ejs", { student });
});

app.put("/attendance/:id", async (req, res) => {
  const { id } = req.params;
  
  console.log(req.body);
  const student = await Attendance.findByIdAndUpdate(
    id,
    { $set: { [req.body.date]: req.body.attendance } },
    {}
  );

  res.redirect(`/attendance/${student._id}`);
});


app.get('/login',(req,res)=>{
  res.render()
})

app.listen(5500, () => {
  console.log("Listening on port 5500");
});


