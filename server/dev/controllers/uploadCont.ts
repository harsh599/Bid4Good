import { Request, Response } from "express";
import { S3Client,  GetObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv' 
import { ImageDetailModel } from "../models/imageDetails";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import aws from "../util/aws-image-store"

dotenv.config();

console.log("Req Received for Upload Controller");

const accessKey = 'AKIA4C5UR2PMKV2ZI2EO';
const secretAccessKey = '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';
const bucketRegion = 'ca-central-1';
const bucketName='bidforgood';


const s3 = new S3Client({
    credentials:{
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region:bucketRegion
});

const uploadImage = async(req: Request, res: Response) => {
    const uploadResult = await aws.uploadImageToAWS(req);
        if(uploadResult){
            res.send(uploadResult);
        }else{
            res.status(500).json({
                message: "Image Upload to aws failed",
              });
        }
        
};

const getUploadedImage = async(req: Request, res: Response)=>{
try{
   const allImages:any =   await ImageDetailModel.findAll();
   for(let i = 0; i < allImages.length; i++){
    const img = allImages[i]['dataValues'];
    const getObjectParams = {
        Bucket: bucketName,
        Key: img.imgName,
       };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        img.imgUrl = url;
   }
   res.send(allImages);
}catch(e){
    console.log("ERROR IN IMAGE FETCHING",e);
    res.status(500).json({
        message: e,
      });
    }
    console.log(req);
};


export default{
    uploadImage,
    getUploadedImage
}