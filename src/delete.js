// imports aws-sdk to interact(delete objects) from s3 bucket 
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

// accesses the bucket name from the environment variable
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
	console.log(event);

	const response = {
		// if the image is not base64 encoded it will return a errorcode 200
		isBase64Encoded: false,
		statusCode: 200,
	};

	try {
		const params = {
			Bucket: BUCKET_NAME,
			// decodes the encoded uri in this case the file stored in the s3 bucket
			Key: decodeURIComponent(event.pathParameters.fileKey),
		};
		// deletes object using aws-sdk
		const deleteResult = await s3.deleteObject(params).promise();

		response.body = JSON.stringify({ message: "Successfully deleted file from S3.", deleteResult });
	} catch (e) {
		console.error(e);
		response.body = JSON.stringify({ message: "Failed to delete file.", errorMessage: e });
		response.statusCode = 500;
	}

	return response;
};