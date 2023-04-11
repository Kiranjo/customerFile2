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
//const port =2410;
var port=process.env.PORT ||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
let {studentsData}=require("./studentData.js");
let fs=require("fs");
let fname="students.json";
app.get("/svr/resetData",function(req,res){
    let data=JSON.stringify(studentsData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404),send(err);
        else res.send("Data in file is reset");
    });
});
app.get("/svr/students",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            res.send(studentsArray);
        }
    });
});
app.get("/svr/students/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let student=studentsArray.find((st)=>st.id===id);
          if(student)  res.send(student);
          else res.status(404).send("No student found");
        }
    });
});
app.get("/svr/students/course/:name",function(req,res){
    let name=req.params.name;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let arr1=studentsArray.filter((st)=>st.course===name);
            res.send(arr1);
          
        }
    });
});

app.post("/svr/students",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if (err){ res.status(404).send(err+"error in read part");
    console.log("error in read part")}
        else{
            let studentsArray=JSON.parse(data);
            console.log(studentsArray);
           let maxid=studentsArray.reduce(
                (acc,curr)=> (curr.id>acc ? curr.id:acc),
                0);
            let newid= maxid+1;
            let newStudent={...body, id:newid };
            console.log(newStudent);

            studentsArray.push(newStudent);
            let data1=JSON.stringify(studentsArray);
            console.log(data1);
            fs.writeFile(fname,data1,function (err){
                if(err){ res.status(404).send(err+"err in write part")
            console.log("error in write part");}
                else{ 
                    console.log(newStudent);
                    res.send(newStudent)
                };
            });
        }
    });
});
 app.put("/svr/students/:id",function(req,res){
    let body=req.body;
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let index=studentsArray.findIndex((st)=>st.id===id);
            if(index>=0){
                updatedStudent={...studentsArray[index],...body};
                studentsArray[index]=updatedStudent;
            let data1=JSON.stringify(studentsArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(updatedStudent);
            });
        }else res.status(404).send("NO student found");
    }
    });
});

app.delete("/svr/students/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let index=studentsArray.findIndex((st)=>st.id===id);
            if(index>=0){
               let deleteStudent=studentsArray.splice(index,1);
            let data1=JSON.stringify(studentsArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(deleteStudent);
            });
        }else res.status(404).send("NO student found");
    }
    });
});
