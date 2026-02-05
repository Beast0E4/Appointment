const generateSlots = (startTime, endTime, duration) => {
  const slots = [];

  let start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  while (start < end) {
    const slotStart = start.toTimeString().slice(0, 5);
    const slotEndDate = new Date(start.getTime() + duration * 60000);
    if (slotEndDate > end) break;

    const slotEnd = slotEndDate.toTimeString().slice(0, 5);
    slots.push({ startTime: slotStart, endTime: slotEnd });

    start = slotEndDate;
  }

  return slots;
};

module.exports = generateSlots;
