const express=require('express')
const nodemailer = require("nodemailer");
const cors = require('cors')
const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const ejs = require('ejs');
const otpGenerator = require('otp-generator');

const prisma = new PrismaClient(); // Initialize Prisma Client

const app=express()

app.use(express.json())

var emailwithOTP=[]

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "sherin.backend.dev@gmail.com",
      pass: "ruin cfhp nfox dmrd",
    },
  });
app.use(cors({
  origin: 'https://passwordreset-test-i8ae.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}))

app.post('/signup',async (req,res)=>
{
    try
    {
    const {email,firstName,lastName,password}=req.body

    const newUser = await prisma.user.create({
        data: {
          email,
          firstname:firstName,
          lastname:lastName,
          password
        },
      });

      res.json({message:"success",newUser})

    }
    catch(err)
    {
        console.error(err)
        res.status(500).json({error:err})
    }
    
})

app.post('/forgot-password', async (req,res)=>
{
    try
    {
        const {email}=req.body
        const data=await prisma.user.findUnique({where:{email}})

        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        emailwithOTP.push({email:email,otp:otp})

        const htmlContent = await ejs.renderFile('resetPasswordTemplate.ejs', { resetPasswordLink: `http://localhost:5173/changepassword?email=${email}&otp=${otp}` });

        if(data)
        {
            var mailOptions = {
                from: 'sherin.backend.dev@gmail.com',
                to: email,
                subject: 'Sending Email using Node.js',
                html: htmlContent
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              return res.json({message:"success"})
        }
        res.json({message:"Failed"})
    }
    catch(err)
    {
        console.error(err)
        response.json({message:"Internal Server Error"})
    }

})

app.post('/verify',async (req,res)=>{
    try
    {
    const {email,otp}=req.body

    function findEmailAndOTP(email, otp) {
        return emailwithOTP.find(item => item.email === email && item.otp === otp);
      }
    
      const foundItem = findEmailAndOTP(email, otp);
      const exists = !!foundItem;

      if(exists)
      {
        return res.json({message:"success"})
      }
      res.json({message:"failed"})

    }
    catch(err)
    {
        console.error(err)
        res.json({message:"Internal Server Error"})
    }
    

})

app.patch('/passwordupdate', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Update the user's password
      const update = await prisma.user.update({
        where: { email },
        data: { password }
      });
  
      if (update) {
        // Password updated successfully
        return res.status(200).json({ message: 'Password updated successfully' });
      } else {
        // No user found with the provided email
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      // Internal server error
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  




app.listen(8080)
