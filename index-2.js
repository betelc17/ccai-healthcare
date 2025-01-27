const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'my-project-ccao';
const firestore = new Firestore({
  projectId: PROJECTID,
});

exports.updateAppointmentDate = async (req, res) => {
  try {
    console.log('Dialogflow Request body:', JSON.stringify(req.body));

    const tag = req.body.fulfillmentInfo?.tag;
    console.log('Tag:', tag);

    const accountID = req.body.sessionInfo.parameters.account_id;
    console.log('Account ID fetched:', accountID);

    // Validate inputs
    if (!accountID) {
      console.log('Missing account ID');
      return res.status(400).send({ 
        fulfillmentResponse: {
        messages: [
          { text: { text: ['Missing account ID. Please provide a valid ID.'] } },
        ],
    },
});
}

if (tag === 'appointment-reschedule') {
    console.log('Processing appointment reschedule');

    // Reference to the Firestore collection
    const collectionRef = firestore.collection('UserInfo').doc(accountID);

    // Fetch the document
    const userDoc = await userRef.get();

    // Log the document details
    console.log('Fetched document:', userDoc);

    // Query Firestore for the document based on account_ID
    const snapshot = await collectionRef.where('account_ID', '==', account_ID).get();

    if (snapshot.empty) {
      return res.status(404).send({ error: "User not found" });
    }

    // Update the appointment_time field for the matched document(s)
    let updateTime = [];
    snapshot.forEach((doc) => {
      updateTime.push(
        doc.ref.update({ appointment_time: newAppointmentDate })
      );
    });

    await Promise.all(updateTime);

    return res.status(200).send({
      message: "Appointment date updated successfully",
      updatedDate: newAppointmentDate,
    });
} catch (error) {
    console.error('Error handling request:', error.message);
    return res.status(500).send({
      fulfillmentResponse: {
        messages: [
          { text: { text: ['An internal server error occurred. Please try again later.'] } },
        ],
      },
    });
  }
};