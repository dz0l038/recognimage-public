export const minConfidence = 85;
export const maxDetectionPerImage = 15;

const awsExports = require('./../../aws-exports')
const REGEX = /.*-(\w+)/
const env = awsExports.default.aws_content_delivery_bucket.match(REGEX)[1]
export const ENV = env;

let stripePublicKey = "pk_test_Osy03paMlB2fBp7i2ilAqwzF";
let bucket_name = "https://recognimage2789848cdf84453c8cc2398cd34ed06c-dev.s3.eu-central-1.amazonaws.com/";
if(ENV === "prod") {
    stripePublicKey = "pk_live_x2mmEhxJt8dt1WG6um2kE44w";
    bucket_name = "https://recognimage2789848cdf84453c8cc2398cd34ed06c-prod.s3.eu-central-1.amazonaws.com/";
}
export const STRIPE_PUBLIC_KEY = stripePublicKey;
export const bucketName = bucket_name;
