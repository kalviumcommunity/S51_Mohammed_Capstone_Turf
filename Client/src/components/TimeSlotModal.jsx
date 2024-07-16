import React, { useState } from 'react';

const TimeSlotModal = ({ onClose, onSave }) => {
  const [fromTime, setFromTime] = useState('12:00 PM');
  const [toTime, setToTime] = useState('12:00 AM');

  const handleSave = () => {
    onSave({ fromTime, toTime });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Set Open Time</h2>
        <div className="mb-4">
          <label className="block text-gray-700">From:</label>
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">To:</label>
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Save
          </button>
          <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotModal;
