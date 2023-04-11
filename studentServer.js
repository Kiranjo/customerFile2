let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port =2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

let {studentsData}=require("./studentData.js");

app.get("/svr/students",function (req,res){
    console.log("GET /svr/students",req.query);
    let courseStr=req.query.course;
    let sort=req.query.sort;
    let grade=req.query.grade;
    let arr1=studentsData;
    if(courseStr){
        let courseArr=courseStr.split(",");
        arr1=arr1.filter((st)=>courseArr.find((c1)=>c1===st.course));
    }
    if(grade){
          arr1=arr1.filter((st)=>st.grade===grade);
    }
    if(sort==="name"){
       arr1.sort((st1,st2)=>st1.name.localeCompare(st2.name));
  }
  if(sort==="course"){
    arr1.sort((st1,st2)=>st1.course.localeCompare(st2.course));
}
    res.send(arr1);
});

app.get("/svr/students/:id",function (req,res){
    let id=+req.params.id;
    let student=studentsData.find((st)=>st.id===id);
    if(student) 
    res.send(student);
    else res.status(404).send("NO student found");
});

app.get("/svr/students/course/:name",function (req,res){
    let name=req.params.name;
    const arr1=studentsData.filter((st)=>st.course===name);
    res.send(arr1);
});

app.post("/svr/students",function (req,res){
    let body=req.body;
    console.log(body);
    let maxid=studentsData.reduce((acc,curr)=>(
        curr.id>=acc?curr.id:acc
    ),0);
    let newid=maxid+1;
    let newStudent={id:newid,...body};
    studentsData.push(newStudent);
    res.send(newStudent);

});

app.put("/svr/students/:id",function (req,res){
    let id=+req.params.id;
    let body=req.body;
    let index=studentsData.findIndex((st)=>st.id===id);
    if(index>=0){
    let updatedStudent={id:id,...body};
    studentsData[index]=updatedStudent;
    res.send(updatedStudent);}
    else
    res.status(404).send("No student found");
   
});

app.delete("/svr/students/:id",function (req,res){
    let id=+req.params.id;
    let index=studentsData.findIndex((st)=>st.id===id);
    if(index>=0){
    let deletedStudent=studentsData.splice(index,1);
    res.send(deletedStudent);}
    else
    res.status(404).send("No student found");
   
});