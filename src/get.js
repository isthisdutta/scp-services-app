// imports aws-sdk to interact(retreive objects) from s3 bucket
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
		// gets object using aws-sdk
		const data = await s3.getObject(params).promise();

		response.body = JSON.stringify({ message: "Successfully retrieved file from S3.", data });
	} catch (e) {
		console.error(e);
		response.body = JSON.stringify({ message: "Failed to get file.", errorMessage: e });
		response.statusCode = 500;
	}

	return response;
};