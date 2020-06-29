exports = async function(eventId, scores) {
  // Get the collection of events
  const eventsCollection = context.services.get("mongodb-atlas").db("rationalize-db").collection("Events");
  const { matchedCount, modifiedCount } = await eventsCollection.updateOne(
    // Search of an event with this ID and the user as a participant
    { _id: { $eq: eventId }, participants: context.user.id },
    // Update the evaluations array for this specific user
    { $set: { [`evaluations.${context.user.id}`]: scores } }
  );
  return { success: matchedCount === 1 && modifiedCount === 1 };
};