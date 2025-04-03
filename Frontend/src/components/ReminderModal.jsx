// ReminderModal.jsx
import React from "react";

const ReminderModal = ({ task, onClose, onAction }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Reminder: {task.name} ({task.type})
        </h2>
        <p className="text-gray-600 mb-4">
          Scheduled at {task.scheduled_time}. Do you want to mark it as done or
          skip?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => onAction("done")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Done
          </button>
          <button
            onClick={() => onAction("skip")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Skip
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
