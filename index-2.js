const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'my-project-ccao';
const firestore = new Firestore({
  projectId: PROJECTID,
});

exports.updateAppointmentTime = async (req, res) => {
  try {
    console.log('Dialogflow Request body:', JSON.stringify(req.body));

    const tag = req.body.fulfillmentInfo?.tag;
    console.log('Tag:', tag);

    const accountID = req.body.sessionInfo.parameters.account_id;
    console.log('Account ID fetched:', accountID);

    const newAppointmentTime = req.body.sessionInfo.parameters.new_appointment_time;
    console.log('New Appointment Time:', newAppointmentTime);

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
    const userDocRef = firestore.collection('UserInfo').doc(accountID);

    // Fetch the document
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        console.log('User not found');
        return res.status(404).send({
          fulfillmentResponse: {
            messages: [
              { text: { text: ['User not found. Please check the account ID and try again.'] } },
            ],
          },
        });
      }

      console.log('User found. Updating appointment time.');

      await userDocRef.update({ appointment_time: newAppointmentTime });

      console.log('Appointment date updated successfully');
      return res.status(200).send({
        fulfillmentResponse: {
          messages: [
            { text: { text: ['Your appointment has been rescheduled successfully.'] } },
          ],
        },
      });
    }
    console.log('Invalid tag received');
    return res.status(400).send({
      fulfillmentResponse: {
        messages: [
          { text: { text: ['Invalid operation. Please try again.'] } },
        ],
      },
    });
  } catch (error) {
    console.error('Error updating appointment date:', error);
    return res.status(500).send({
      fulfillmentResponse: {
        messages: [
          { text: { text: ['An internal server error occurred. Please try again later.'] } },
        ],
      },
    });
  }
};