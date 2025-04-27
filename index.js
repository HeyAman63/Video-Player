import express from "express";
import cors from "cors"
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import {exec} from "child_process"; // watch out
import { error } from "console";
import { stderr, stdout } from "process";

const app = express();
const port = 4000

app.use(
    cors({
        origin:[`https://localhost:${port}`, `https://localhost:5173`],
        Credential:true,
    })
)

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headres",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads", express.static("uploads"));


// multer midleware
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./uploads")
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname+"-"+uuidv4()+path.extname(file.originalname))
    }
})

//Multer Configuration 

const upload = multer({storage: storage})


// routes
app.get("/",(req,res)=>{
    res.json({message:"Hello from Aman Chaurasiya"})
})

app.post("/upload", upload.single("file"),(req,res)=>{
    const lessonId= uuidv4();
    const videoPath= req.file.path;
    const outputPath= `./uploads/courses/${lessonId}`
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log("hlsPath", hlsPath);
    // ffmpeg command

    const ffmpegComand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`


    // no queue because of proof POC, not to be used in production
    exec(ffmpegComand, (error, stderr, stdout)=>{
        if(error){
            console.log(`exec error : ${error}`)
        }
        console.log(`stderr : ${stderr}`)
        console.log(`stderr : ${stdout}`)

        const videoUrl= `http://localhost:${port}/uploads/courses/${lessonId}/index.m3u8`;

        res.json({
            message:"video converted to hls formate",
            videoUrl:videoUrl,
            lessonId:lessonId,
        })
    })

    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive:true})
    }

})

app.listen(port,(req,res)=>{
    console.log("server has started : ", port)
})
