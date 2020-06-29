exports = async function(eventId) {
  // Get the collection of events
  const eventsCollection = context.services.get("mongodb-atlas").db("rationalize-db").collection("Events");
  // Add this user to the list of participants
  const { matchedCount, modifiedCount } = await eventsCollection.updateOne(
    { _id: BSON.ObjectId(eventId) },
    { $push: { participants: context.user.id } }
  );
  return { success: matchedCount === 1 && modifiedCount === 1 };
};