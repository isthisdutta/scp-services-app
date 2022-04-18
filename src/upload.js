// imports aws-sdk to interact(upload objects) to s3 bucket
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

// bucket name env var will be set in serverless.yml file
// accesses the bucket name from the environment variable
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async event => {
    console.log(event);

    const response = {
        // if the image is not base64 encoded it will return a errorcode 200
        isBase64Encoded: false,
        statusCode: 200,
    };

    try {
        // the body must be a base64 encoded JSON file
        // parsedBody and base64 file parse the JSON and retreive the base64 encoded image
        const parsedBody = JSON.parse(event.body);
        const base64File = parsedBody.file;
        // the image is then decoded and params are uploaded
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const params = {
            Bucket: BUCKET_NAME,
            Key: parsedBody.fileKey,
            Body: decodedFile,
            ContentType: "image/jpeg",
        };
        // uploads object to a s3 bucket using aws-sdk
        const uploadResult = await s3.upload(params).promise();

        response.body = JSON.stringify({ message: "Successfully uploaded file to S3", uploadResult });
    } catch (e) {
        console.error("Failed to upload file: ", e);
        response.body = JSON.stringify({ message: "File failed to upload.", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};