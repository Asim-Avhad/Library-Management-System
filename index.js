import express from "express";
import bodyParser from "body-parser";
import date from 'date-and-time';

import {staff_info,student_info,recent,material_info,history} from './app.js';


// import alert from 'alert';

const app = express();
const port = process.env.PORT || 3000


//using middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



//endpoint after succefull login by staff member
app.get("/staff", async(req, res) => {
    const now=new Date();
    const username=req.query.username;
    const role=req.query.role;
    console.log("staff page revcieved"+username)
    console.log("staff page revcieved"+role)
    let totalb=0;
    let totalm=0;
    let totalr=0;
    let issueb=0;
    let issuem=0;
    let issuer=0;
    let remainingb=0;
    let remainingm=0;
    let remainingr=0;
    try {
      const totalBooks = await material_info.aggregate([
          {
              $match: { material_type: "Book" }
          },
          {
              $group: {
                  _id: null,
                  totalBooks: { $sum: "$material_count" }
              }
          }
      ]);
     try {
      console.log("Total number of books:", totalBooks);
       totalb= totalBooks[0].totalBooks;
  
     } catch (error) {
      console.log("no books found")
     }
      
  } catch (error) {
 
    console.log('Error:',error);
       
  }
  
  try {
    const totalMagazines = await material_info.aggregate([
        {
            $match: { material_type: "Magazine" }
        },
        {
            $group: {
                _id: null,
                totalMagazines: { $sum: "$material_count" }
            }
        }
    ]);
   try {
    console.log("Total number of magazines:", totalMagazines);
    totalm= totalMagazines[0].totalMagazines;
   } catch (error) {
    console.log("no magazines found")
   }
   

} catch (error) {

  console.log('Error:',error);
     
}
try {
  const totalResearchPaper = await material_info.aggregate([
      {
          $match: { material_type: "Research Paper" }
      },
      {
          $group: {
              _id: null,
              totalResearchPaper: { $sum: "$material_count" }
          }
      }
  ]);
try {
  console.log("Total number of Research Paper:", totalResearchPaper);
   totalr= totalResearchPaper[0].totalResearchPaper;

} catch (error) {
  console.log("No research paper found")
}
  
} catch (error) {

console.log('Error:',error);
   
}
//issue block
try {
  const issueBooks = await recent.aggregate([
      {
          $match: { 'material.material_type': "Book" }
      },
      {
          $group: {
              _id: null,
              totalBooks: { $sum:1 }
          }
      }
  ]);
  try {
    console.log("Total number of  issued books:", issueBooks);
   issueb= issueBooks[0].totalBooks;
  } catch (error) {
    console.log("No issued books found")
  }
} catch (error) {

console.log('Error:',error);
   
}


try {
  const issueMagazines = await recent.aggregate([
      {
          $match: { 'material.material_type': "Magazine" }
      },
      {
          $group: {
              _id: null,
              totalMagazines: { $sum:1 }
          }
      }
  ]);
  try {
    console.log("Total number of  issued Magazines:", issueMagazines);
   issuem= issueMagazines[0].totalMagazines;
  } catch (error) {
    console.log("No issued magazines found")
  }

} catch (error) {

console.log('Error:',error);
   
}


try {
  const issueResearchPaper = await recent.aggregate([
      {
          $match: { 'material.material_type': "Research Paper" }
      },
      {
          $group: {
              _id: null,
              totalResearchPaper: { $sum: 1 }
          }
      }
  ]);
  try {
    console.log("Total number of  issued Research Paper:", issueResearchPaper);
   issuer= issueResearchPaper[0].totalResearchPaper;
  } catch (error) {
    console.log("no issued research paper found")
  }
  

} catch (error) {

console.log('Error:',error);
   
}


//remaining to return

try {
  const remainBooks = await recent.aggregate([
      {
        $match: {return_date:{$lt :new Date()} }
      },
      {
        $match: { 'material.material_type': "Book" }
    },
      {
          $group: {
              _id: null,
              totalBooks: { $sum:1 }
          }
      }
  ]);
try {
  console.log("Total number of books:", remainBooks);
  remainingb= remainBooks[0].totalBooks;
} catch (error) {
  console.log("No book is pending to return")
}
 

} catch (error) {
  console.error('Error:', error);
}

try {
  const remainMagazines = await recent.aggregate([
      {
        $match: {return_date:{$lt :new Date()} }
      },
      {
        $match: { 'material.material_type': "Magazine" }
    },
      {
          $group: {
              _id: null,
              totalMagazines: { $sum:1 }
          }
      }
  ]);
  try {
    console.log("Total number of magazines:",remainMagazines);
    remainingm= remainMagazines[0].totalMagazines;
  } catch (error) {
    console.log("no magazine is pending to return")
  }
 

} catch (error) {
  console.error('Error:', error);
}

try {
  const remainResearchPapers = await recent.aggregate([
      {
        $match: {return_date:{$lt :new Date()} }
      },
      {
        $match: { 'material.material_type': "Research Paper" }
    },
      {
          $group: {
              _id: null,
              totalResearchPaper: { $sum: 1 }
          }
      }
  ]);
  try {
    console.log("Total number of research paper:", remainResearchPapers);
    remainingr=  remainResearchPapers[0].totalResearchPaper;
  } catch (error) {
    console.log("no research paper is pending to return")
  }
  

} catch (error) {
  console.error('Error:', error);
}

try {
  // For Books
  const allhistory = await history.find();

 try {
   console.log('All history:', allhistory);
   const r=allhistory[0].return_date
 } catch (error) {
   console.log("no history to return")
 }

 console.log(allhistory[0].material.material_name )
 console.log(totalb)
    res.render("staff.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role,totalbooks:totalb,totalmagazines:totalm,totalresearchpapers:totalr,
    total:totalb+totalm+totalr,totalissued:issueb+issuem+issuer,issuedmagazines:issuem,issuedbooks:issueb,issuedresearchpapers:issuer
    ,totalremaining:remainingb+remainingm+remainingr,remainingb:remainingb,remainingm:remainingm,remainingr:remainingr,allhistory:allhistory
  });
} catch (error) {
 console.error('Error:', error);
}






  });
  // 
//endpoint for new sign in   
app.post("/signin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
})

//endpoint for first login page
app.get("/",(req,res)=>{

    console.log("login page opened");
    res.render("login.ejs");
  })

//endpoint for collecting the data from login page 
app.post("/",async(req,res)=>{

    console.log(req.body);
    console.log("post login")
    const username=parseInt(req.body.username);
    const password=req.body.password;
  try {

    const found_staff= staff_info.findOne({staffcrn:username}).then((user)=>{
  
      if(!user){
        console.log("No data found")
        // res.alert("User Dont exist")
        
        res.send('<script>alert("User Not found"); window.location="/";</script>')
            }
      else{
        if(password==user.password){
          console.log("authentication done")
          console.log("founded user during login"+user);
          
          if(user.role==="administrator"){res.send(`<script>alert("Welcome Admin , Directing To Administartor Page!"); window.location="/administrator/?username=${user.staffname}&role=${user.role}";</script>`)
        }
        else{
          res.send(`<script>alert(" Welcome!"); window.location="/staff/?username=${user.staffname}&role=${user.role}";</script>`)
        }
        }
        else{
          console.log("authentication failed")
          res.send('<script>alert("Incorect Password"); window.location="/";</script>')
          
        
        }

      } 
      }).catch((err)=>{
        console.log(err)
      })
    
  } catch (error) {
    console.log(error)
  }
    
    })
  
//endpooint for issuinf=g and return
app.get("/issue",(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  console.log("issue page revcieved"+username)
  console.log("issue page revcieved"+role)
  // const password;
  console.log("ISSUE RETURN page opened");
  const now=new Date();
  res.render("students.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role});
})

app.post("/issue",async(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  const now=new Date();
  console.log("posting page of issue/return is opened")
  console.log(req.body)

  if(req.body.submit_type ==="issue"){
  console.log("ISSUE ");
  try {
    const studdel= await student_info.findOne({crn:req.body.student_crn});
    if(!studdel){
      console.log("student not found")
    
      res.send(`<script>alert(" OOPS! Student Not Found!"); window.location="/issue/?username=${username}&role=${role}";</script>`)
    }
    else{
      try {
        const matdel= await material_info.findOne({material_id:req.body.material_id});
        if(!matdel){
          console.log("collection not found")
          res.send(`<script>alert("OOPS! Collection Not found!");window.location="/issue/?username=${username}&role=${role}";</script>`)}
         
        else{ 
          // material:materialSchema,
          // student:studentSchema,
          // issue_date:Date,
          // return_adate:Date
          try {
            if(studdel.maxbook>0 && matdel.material_count>0){
            const recentmat=await recent.create(
              {
                
                material:matdel,
                student:studdel,
                issue_date:date.format(now,'YYYY/MM/DD'),
                return_date:req.body.return_date
                // material_users:Array
              }
            )
            const log=await history.create(
              {
                
                material:matdel,
                student:studdel,
                issue_date:date.format(now,'YYYY/MM/DD'),
                return_date:req.body.return_date,
                action:"Issued"
                // material_users:Array
              }
            )


            console.log(log)
            console.log(req.body.return_date)
            const updatedstudent= await student_info.findOneAndUpdate(
              {crn:req.body.student_crn},{$set:{maxbook:(studdel.maxbook)-1}})
            const updatedcollection= await material_info.findOneAndUpdate(
              {material_id:req.body.material_id},{$set:{material_count:(matdel.material_count)-1}})
              const pushedmaterial = await student_info.findOneAndUpdate(
                {crn:req.body.student_crn}, 
                { $push: { recent_books:updatedcollection.material_id}} 
               );
                 const pushedstudent= await material_info.findOneAndUpdate(
                  {material_id:req.body.material_id}, 
                  { $push: { material_users:updatedstudent.crn}}
               );
            
            console.log("successfully issued")
            res.send(`<script>alert("Successfully Isuued");  window.location="/issue/?username=${username}&role=${role}";</script>`)  
           
            }
            else{
              console.log("issued declined max books reached or no Collection available at the moment")
              res.send(`<script>alert("Issue Declined Out of limit  or No collection avaialbe now!!");  window.location="/issue/?username=${username}&role=${role}";</script>`)
            }
           } catch (error) {
            console.log(error)
           } 
        }
         
        }
      
      
      catch (error) {
        console.log(error)
      }
    }
  }
  catch (error) {
    console.log(error)
  }
}
  else{

  console.log("RETURN")

try {
  const returnedmaterial= await recent.findOne({"material.material_id":req.body.material_id,"student.crn":req.body.student_crn})
if(!returnedmaterial) 
{
  console.log("No record Found")
  res.send(`<script>alert("OOPS! You havent issued this Collection !"); window.location="/issue/?username=${username}&role=${role}";</script>`)

}
else{
  const studdel= await student_info.findOne({crn:req.body.student_crn});
    if(!studdel){
      console.log("student not found")
    
      res.send(`<script>alert(" OOPS! Student Not Found!"); window.location="/issue/?username=${username}&role=${role}";</script>`)
    }
    else{
  const studdel= await student_info.findOne({crn:req.body.student_crn});
  const matdel= await material_info.findOne({material_id:req.body.material_id});
  
  const historydel= await history.findOne({"material.material_id":req.body.material_id,"student.crn":req.body.student_crn})
  let action1;
  if (new Date() > (historydel.return_date)){
 action1="Returned late"
  }
else{
action1="Returned"
}
console.log(action1)
  const log=await history.create(
    {
      
      material:matdel,
      student:studdel,
      issue_date:historydel.issue_date,
      return_date:new Date(),
      
      action:action1
      // material_users:Array 
    }
  )
  const updatedstudent= await student_info.findOne({crn:req.body.student_crn})
  console.log(updatedstudent.maxbook)
  const updatedmat= await material_info.findOne({material_id:req.body.material_id})
  console.log(returnedmaterial)
  const stud = await student_info.updateOne({crn:req.body.student_crn, $set:{maxbook:(updatedstudent.maxbook)+1}})
  const updatedcollection= await material_info.findOneAndUpdate(
    {material_id:req.body.material_id},{$set:{material_count:(updatedmat.material_count)+1}})
    const deleted= await recent.deleteOne({"material.material_id":req.body.material_id,"student.crn":req.body.student_crn})
    console.log("Book returned successfully")
    res.send(`<script>alert("Book returned successfully!"); window.location="/issue/?username=${username}&role=${role}";</script>`)
    }}

} catch (error) {
  console.log(error)
}

  }
 
  
  // setTimeout(()=>{  res.render("staff.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username});
  // },8000);
  res.render("students.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role});
  
})
//ADMINISTRATOR PAGE
app.get("/administrator",(req,res)=>{
  const now=new Date();
  const username=req.query.username;
  const role=req.query.role;
  console.log("administrator page revcieved"+username)
  console.log("administrator page revcieved"+role)
  console.log("administrator page has opened")
  res.render("administrator.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role})
})

//ADMONISTRATOR ACTIVITIES ROUTE

app.post("/administrator/addBook",async(req,res)=>{
  console.log("admin is addding new book")
  const username=req.query.username;
  const role=req.query.role;
  // material_id:String,
  // material_type:String,
  // material_name:String,
  // material_author:String,
  // material_price:Number,
  // material_users:Array
 console.log(req.body)
  try {
      const mat=await material_info.create(
        {
          
          material_id:req.body.material_id,
          material_type:req.body.material_type,
          material_name:req.body.material_name,
          material_author:req.body.material_author,
          material_price:req.body.material_price,
          material_users:[]
        }
      )
      
     } catch (error) {
      console.log(error)
     } 
     res.send(`<script>alert("Collection Successfully Added !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
     
})









app.post("/administrator/removeBook",async(req,res)=>{
  console.log("admin is removing a book")
  const username=req.query.username;
  const role=req.query.role;
  // material_id:String,
  // material_type:String,
  // material_name:String,
  // material_author:String,
  // material_price:Number,
  // material_users:Array
  try {
    const matdel= await material_info.findOneAndRemove({material_id:req.body.material_id});
    if(!matdel){
      console.log("material not found")
      res.send(`<script>alert("OPPS! Collection Not found !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
     
    }
  }
  catch (error) {
    console.log(error)
  }
  res.send(`<script>alert("Collection Successfully Removed !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
     
})









app.post("/administrator/addStudent",async(req,res)=>{
  console.log("admin is addding new student")
  const username=req.query.username;
  const role=req.query.role;
  console.log(req.body)
  try {
      const student=await student_info.create(
        {
          
          name:req.body.student_name,
          class:req.body.student_class,
          crn:req.body.student_crn,
          mob:req.body.student_mobile,
          fine:0,
          maxbook:3,
          recent_books:[]
        }
      )
      
     } catch (error) {
      console.log(error)
     } 
     res.send(`<script>alert("Student Successfully Added !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
     
})









app.post("/administrator/removeStudent",async(req,res)=>{
  console.log("admin is removing a student")
  const username=req.query.username;
  const role=req.query.role;
  console.log(req.body)
  // name:String,
  // class:String,
  // crn:Number,
  // mob:String,
  // fine:Number,
  // maxbook:Number,
  // recent_books:Array
  try {
    const studdel= await student_info.findOneAndRemove({crn:req.body.student_crn});
    if(!studdel){
      console.log("student not found")
      res.send(`<script>alert("OOPS! Student Not Found !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
    }
  }
  catch (error) {
    console.log(error)
  }
  res.send(`<script>alert("Student Successfully Removed !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
})










app.post("/administrator/addStaff",async(req,res)=>{
  console.log("admin is addding new staff")
  console.log(req.body)
 
  const username=req.query.username;
  const role=req.query.role;

  try {
      const staff=await staff_info.create(
        {
          
          staffname:req.body.staff_name,
          staffcrn:req.body.staff_crn,
          email:req.body.staff_email,
          staffmob:req.body.mobile_number,
          password:req.body.password,
          role: req.body.staff_position
        }
      )
      
     } catch (error) {
      console.log(error)
     } 
     res.send(`<script>alert("Staff Successfully Added !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
})













app.post("/administrator/removeStaff",async(req,res)=>{
  console.log("admin is removing a staff")
  const username=req.query.username;
  const role=req.query.role;
  console.log(req.body)
try {
  const staffdel= await staff_info.findOneAndRemove({staffcrn:req.body.staff_crn});
  if(!staffdel){
    console.log("staff not found")
    res.send(`<script>alert("OOPS! Staff Not Found !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
  }
}
catch (error) {
  console.log(error)
}

res.send(`<script>alert("Staff Successfully Removed !"); window.location="/administrator/?username=${username}&role=${role}";</script>`)
})






app.get("/getbooks",async(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  const type=req.query.type;
  const now=new Date();
  // const allBooks=[];
  try {
    // For Books
    const allBooks = await material_info.find({ material_type: 'Book' });

    // For Magazines
    const allMagazines = await material_info.find({ material_type: 'Magazine' });

    // For Research Papers
    const allResearchPapers = await material_info.find({ material_type: 'Research Paper' });

    // Do something with the retrieved data
    try {
      console.log('All Books:', allBooks);
      const r=allBooks[0].return_date
    } catch (error) {
      console.log("no book to show")
    }
   try {
    console.log('All Magazines:', allMagazines);
    const r=allMagazines[0].return_date
   } catch (error) {
    console.log("no maagzine to show")
   }
    try {
      console.log('All Research Papers:', allResearchPapers);
      const r=allResearchPapers[0].return_date
    } catch (error) {
      console.log("no research paper to show")
    }
    res.render("books.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role,books:allBooks ,magazines:allMagazines,researchpapers:allResearchPapers,type:type})

} catch (error) {
    console.error('Error:', error);
}


})

// getting req for issued
app.get("/issued",async(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  const type=req.query.type;
  const now=new Date();
  // const allBooks=[];
  try {
    // For Books
    const allBooks = await recent.find({ "material.material_type": 'Book' });

    // For Magazines
    const allMagazines = await recent.find({ "material.material_type": 'Magazine' });

    // For Research Papers
    const allResearchPapers = await recent.find({ "material.material_type": 'Research Paper' });

    // Do something with the retrieved data
    try {
      console.log('All Books:', allBooks);
      const r=allBooks[0].return_date
    } catch (error) {
      console.log("no book issued")
    }
   try {
    console.log('All Magazines:', allMagazines);
    const r=allMagazines[0].return_date
   } catch (error) {
    console.log("no magzine issued")
   }
    try {
      console.log('All Research Papers:', allResearchPapers);
      const r=allResearchPapers[0].return_date
    } catch (error) {
      console.log("no research paper issued")
    }
    res.render("record.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role,books:allBooks ,magazines:allMagazines,researchpapers:allResearchPapers,type:type})

} catch (error) {
    console.error('Error:', error);
}

})

//getting req for remaining to return
app.get("/remain",async(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  const type=req.query.type;
  const now=new Date();
  // const allBooks=[];
  try {
     // For Books
     const allBooks = await recent.find({$and:[{ "material.material_type": 'Book' },{return_date:{$lt:new Date()}}]});

     // For Magazines
     const allMagazines = await recent.find({$and:[{ "material.material_type": 'Magazine' },{return_date:{$lt:new Date()}}]});
 
     // For Research Papers
     const allResearchPapers = await recent.find({$and:[{ "material.material_type": 'Research Paper' },{return_date:{$lt:new Date()}}]});

    // Do something with the retrieved data
    try {
      console.log('All Books:', allBooks);
      const r=allBooks[0].return_date
    } catch (error) {
      console.log("no book to return")
    }
   try {
    console.log('All Magazines:', allMagazines);
    const r=allMagazines[0].return_date
   } catch (error) {
    console.log("no maagzine to return")
   }
    try {
      console.log('All Research Papers:', allResearchPapers);
      const r=allResearchPapers[0].return_date
    } catch (error) {
      console.log("no research paper to return")
    }
    
    res.render("return.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role,books:allBooks ,magazines:allMagazines,researchpapers:allResearchPapers,type:type})

} catch (error) {
    console.error('Error:', error);
}

})


//get all history
app.get("/gethistory",async(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  const type=req.query.type;
  const now=new Date();
  // const allBooks=[];
  try {
     // For Books
     const allhistory = await history.find();

    try {
      console.log('All history:', allhistory);
      const r=allhistory[0].return_date
    } catch (error) {
      console.log("no history to return")
    }
   
    
    
    res.render("return.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role,allhistory:allhistory ,type:type})

} catch (error) {
    console.error('Error:', error);
}

})

app.get("/studstaff",async(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  const type=req.query.type;
  const now=new Date();
  
  try {
    // For Books
    const allstudents = await student_info.find();

   try {
     console.log('All Students:', allstudents);
     const r=allstudents[0].crn
   } catch (error) {
     console.log("no student in database")
   }
  
   const allstaffs = await staff_info.find();

   try {
     console.log('All Staffs:', allstaffs);
     const r=allstaffs[0].staffcrn
   } catch (error) {
     console.log("no staff in database")
   }
   
   res.render("return.ejs",{date: date.format(now,'YYYY/MM/DD HH:mm:ss'),name:username,position:role,allstudents:allstudents,allstaffs:allstaffs ,type:type})

} catch (error) {
   console.error('Error:', error);
}

})


app.get("/contact",(req,res)=>{
  const username=req.query.username;
  const role=req.query.role;
  const type=req.query.type;
  const now=new Date();
  res.send(`<script>alert("Hey Jatin Here ,Glad to know that you want to contact me! But this page is still underprogress! "); window.location="/staff/?username=${username}&role=${role}"</script>`)
}

)

//listening on port
  app.listen(port, () => {
   
    console.log(`Listening on port ${port}`);
  });

  const staff={
    username:102,
    password:"patil@123"
  }