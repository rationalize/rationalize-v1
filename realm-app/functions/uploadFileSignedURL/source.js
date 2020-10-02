exports = async function () {
  const { user } = context

  const service = 'AWS-S3-File-Uploads'
  const region = 'us-east-1'

  const bucket = 'tz-rationalize-dev'

  const id = new BSON.ObjectId()
  const key = `uploads/${user.id}/${id}`

  const params = {
    Bucket: bucket,
    Key: key,
    Method: 'PUT',
    ExpirationMS: 3600000, // 1 hour
    Metadata: {
      acl: 'public',
      storage_class: 'STANDARD',
    },
  }

  const s3 = context.services.get(service).s3(region)
  return await s3.PresignURL(params)
}
