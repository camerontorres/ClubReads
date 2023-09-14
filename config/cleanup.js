const Event = require('../Models/calendar');

async function cleanupOldEvents() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    await Event.deleteMany({ start: { $lt: oneMonthAgo } });
    console.log('Old events deleted.');
  } catch (error) {
    console.error('Error deleting old events:', error);
  }
}