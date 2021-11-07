import { XAWS } from '../utils/setupAWSXRay'

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const {
  IMAGE_ATTACHMENTS_BUCKET: bucketName,
} = process.env

/**
 * @name getUploadURLForAttachment
 * @description Generates a signed URL that enables you to put an image in
 * this app's attachments bucket.
 * @param {string} fileName - the name of the image. Note that AWS S3 allows
 * the following values:
 * - file name with some extension e.g foo.jpg.
 * - file name with no extension e.g foobar.
 * - file name that is actually the relative path for the file. You can use
 * this to place files in the directories you desire e.g foo/bar/example.png.
 * @param {number} expirationSeconds - how many seconds this link should be
 * valid for before it expires.
 * @returns {string} - a signed URL for uploading the attachment.
 */
export const getUploadURLForAttachment = (fileName: string, expirationSeconds: number): string => {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: fileName,
    Expires: expirationSeconds
  })
}
