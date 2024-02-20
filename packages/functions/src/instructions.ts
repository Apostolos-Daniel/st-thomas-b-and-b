import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { Bucket } from 'sst/node/bucket';

const s3Client = new S3Client({ region: 'us-east-1' }); // Replace 'your-region' with your S3 bucket region

const bucketName = Bucket.Uploads.bucketName; // Replace with your actual bucket name
const objcetKey = "final/test.html"; // S3 key for the modified file


export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: objcetKey,
        });
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Signed URL expires in 1 hour
        console.log('Pre-signed URL:', signedUrl);
        console.log('Redirecting to pre-signed URL')
        return {
            statusCode: 302, // HTTP status code for redirection
            headers: {
                Location: signedUrl,
            },
            body: '', // No body is needed for a redirect response
        };
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return { statusCode: 500, body: 'Internal server error' };
    }
};
