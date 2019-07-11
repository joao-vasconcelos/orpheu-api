/* * */
/* * */
/* * * * * */
/* STORAGE HANDLING */
/* * */

/* * */
/* IMPORTS */
const config = require("config");
const aws = require("aws-sdk");

/* * */
/* Create a new instance of S3 Storage Controller */
/* This is the object responsible for managing files */
const S3 = new aws.S3({
  endpoint: new aws.Endpoint(config.get("storage.endpoint")),
  accessKeyId: config.get("storage.key"),
  secretAccessKey: config.get("storage.secret")
});

/* * */
/* Upload method for files. */
/* Uploads one file at a time and returns its location URL */
async function uploadFile(file, name, acl) {
  const params = {
    Bucket: "orpheu",
    ACL: acl ? acl : "public-read",
    Key: name ? name : file.name,
    Body: file.data
  };

  let url = "";
  await S3.upload(params)
    .promise()
    .then(uploadedFile => {
      url = uploadedFile.Location;
    })
    .catch(err => {
      console.log(err);
    });

  return url;
}

exports.uploadFile = uploadFile;
