import mongoose, { isObjectIdOrHexString } from "mongoose";

// mongoose.connect("mongodb://localhost:27017/kkwagh_lib")
// .then( () => console.log("connected to DB."))
// .catch( err => console.log(err));
// establishing the connection with database
async function run(){const connection=await mongoose.connect("mongodb://127.0.0.1:27017/kkwagh_lib")
.then( () => console.log("connected to DB."))
.catch( err => console.log(err));}

run();



//creating schema for various data collections

//1.schema for staff info
const staffSchema= new mongoose.Schema({
  staffname:String,
  staffcrn:Number,
  email:String,
  staffmob:String,
  password:String,
  role:String

})

//2.schema for student info
const studentSchema=new mongoose.Schema({
  name:String,
  class:String,
  crn:Number,
  mob:String,
  fine:Number,
  maxbook:Number,
  recent_books:Array
})

//3.schema for logging the activities
const materialSchema=new mongoose.Schema({
  material_id:String,
  material_type:String,
  material_name:String,
  material_author:String,
  material_price:Number,
  material_count:Number,
  material_users:Array
})

//4.schema for recent purchase-
const recentSchema=new mongoose.Schema({
  material:materialSchema,
  student:studentSchema,
  issue_date:Date,
  return_date:Date
})

const historySchema=new mongoose.Schema({
  material:materialSchema,
  student:studentSchema,
  action:String,

  issue_date:Date,
  return_date:Date
})

const staff_info=mongoose.model("staff_info",staffSchema)
const recent=mongoose.model("recent",recentSchema)
const student_info=mongoose.model("student_info",studentSchema)
const material_info=mongoose.model("material_info",materialSchema)
const history=mongoose.model("log",historySchema)


export{staff_info,student_info,recent,material_info,history}