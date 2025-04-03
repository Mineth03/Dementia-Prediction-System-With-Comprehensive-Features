import React, { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import { useAuth } from "../context/AuthContext";
import ReminderModal from "../components/ReminderModal";

// Chart.js and required elements
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement, // For Pie/Donut Charts
  BarElement, // For Bar Charts
  CategoryScale, // For X-axis scale
  LinearScale, // For Y-axis scale
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth(); // Get authenticated user's data
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [upcomingTask, setUpcomingTask] = useState(null);
  const [sleepHours, setSleepHours] = useState("");
  const [reportData, setReportData] = useState(null);

  // Track task actions for the current day
  const [taskStatus, setTaskStatus] = useState(() => {
    const savedStatus = localStorage.getItem("taskStatus");
    return savedStatus ? JSON.parse(savedStatus) : {};
  });

  // Fetch patient data and check for upcoming tasks
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get-patient/${user?.username}`
        );
        const data = await response.json();

        if (data.success) {
          setPatientData(data.data);
          setEditedData(data.data);
          checkForUpcomingTasks(data.data);
        } else {
          console.error("Error fetching patient data:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (user?.username) {
      fetchPatientData();
    }
  }, [user]);

  // Check for upcoming tasks in the next 10 minutes
  const checkForUpcomingTasks = (data) => {
    const now = new Date();
    const tasks = [
      ...data.medications.map((med) => ({
        ...med,
        type: "medication",
        name: med.medication_name,
      })),
      ...data.daily_routines.map((routine) => ({
        ...routine,
        type: "routine",
        name: routine.routine_name,
      })),
    ];

    tasks.forEach((task) => {
      const [hours, minutes] = task.scheduled_time.split(":");
      const taskTime = new Date(now);
      taskTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      const diff = (taskTime - now) / (1000 * 60); // Difference in minutes
      const taskKey = `${task.name}_${task.type}_${now.toDateString()}`;

      // Skip if task was already marked done/skip
      if (taskStatus[taskKey] === "done" || taskStatus[taskKey] === "skipped") {
        return;
      }

      // Show reminder if task is within 10 mins
      if (diff > 0 && diff <= 10) {
        console.log(`✅ Upcoming task detected: ${task.name}`);
        setUpcomingTask({ ...task, taskKey, taskTime });
      }

      // Auto-mark as skip if 10 mins passed without action
      if (diff < 0 && diff >= -10 && !taskStatus[taskKey]) {
        console.log(`⚠️ Auto-marking task as skipped: ${task.name}`);
        markTaskAsSkipped(taskKey);
      }
    });
  };

  // Handle Task Action (Done/Skip)
  const handleTaskAction = async (action) => {
    if (upcomingTask) {
      const taskKey = upcomingTask.taskKey;
      const updatedStatus = { ...taskStatus, [taskKey]: action };
      setTaskStatus(updatedStatus);
      localStorage.setItem("taskStatus", JSON.stringify(updatedStatus));

      try {
        const response = await fetch(`http://localhost:5000/log-task`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user?.username,
            task_name: upcomingTask.name,
            task_type: upcomingTask.type,
            action: action,
            timestamp: new Date(),
          }),
        });

        if (response.ok) {
          console.log(`✅ Task marked as ${action}`);
        } else {
          console.error("Error logging task.");
        }
      } catch (error) {
        console.error("Error logging task:", error);
      }
    }
    setUpcomingTask(null);
  };

  // Mark task as skipped if no action taken within 10 minutes
  const markTaskAsSkipped = (taskKey) => {
    const updatedStatus = { ...taskStatus, [taskKey]: "skipped" };
    setTaskStatus(updatedStatus);
    localStorage.setItem("taskStatus", JSON.stringify(updatedStatus));
    setUpcomingTask(null);
  };

  // Handle Modal Close (Reopen until 10 mins after scheduled time)
  const handleModalClose = () => {
    if (upcomingTask) {
      const diff = (new Date() - upcomingTask.taskTime) / (1000 * 60);
      if (diff <= 10) {
        setTimeout(() => setUpcomingTask(upcomingTask), 3000);
      } else {
        markTaskAsSkipped(upcomingTask.taskKey);
      }
    }
  };

  // Reset task status at midnight for a fresh start
  const resetTaskStatus = () => {
    localStorage.removeItem("taskStatus");
    setTaskStatus({});
  };

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );

    const timeUntilMidnight = nextMidnight - now;
    const resetTimer = setTimeout(resetTaskStatus, timeUntilMidnight);

    return () => clearTimeout(resetTimer);
  }, []);

  // Handle Input Changes in Edit Mode
  const handleInputChange = (e, index, field, type) => {
    const newData = { ...editedData };
    if (type === "medication") {
      newData.medications[index][field] = e.target.value;
    } else if (type === "routine") {
      newData.daily_routines[index][field] = e.target.value;
    }
    setEditedData(newData);
  };

  // Add New Medication or Routine
  const addItem = (type) => {
    const newData = { ...editedData };
    if (type === "medication") {
      newData.medications.push({
        medication_name: "",
        dosage: "",
        scheduled_time: "",
        frequency: "",
      });
    } else if (type === "routine") {
      newData.daily_routines.push({
        routine_name: "",
        scheduled_time: "",
        frequency: "",
      });
    }
    setEditedData(newData);
  };

  // Remove Medication or Routine
  const removeItem = (index, type) => {
    const newData = { ...editedData };
    if (type === "medication") {
      newData.medications.splice(index, 1);
    } else if (type === "routine") {
      newData.daily_routines.splice(index, 1);
    }
    setEditedData(newData);
  };

  // Save Updated Data to MongoDB
  const saveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/update-patient/${user?.username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedData),
        }
      );

      if (response.ok) {
        alert("Patient data updated successfully!");
        setPatientData(editedData);
        setIsEditing(false);
      } else {
        console.error("Error updating patient data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Log Sleep Data
  const logSleepData = async () => {
    if (!sleepHours) {
      alert("Please enter valid sleep hours.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/log-sleep`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.username,
          date: new Date().toISOString().split("T")[0],
          hours_slept: sleepHours,
        }),
      });

      if (response.ok) {
        alert("Sleep data logged successfully!");
        setSleepHours("");
      } else {
        console.error("Error logging sleep data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate Weekly Report
  const generateWeeklyReport = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/generate-report?username=${user?.username}`
      );
      const data = await response.json();
  
      if (data.success) {
        setReportData(data.report);
      } else {
        console.error("Error generating report.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };  

  if (!patientData) {
    return <p className="text-center text-gray-600">Loading patient data...</p>;
  }

  const exportReportAsImage = async () => {
    const reportElement = document.getElementById("weekly-report");
    if (!reportElement) return;
  
    const canvas = await html2canvas(reportElement);
    const imageData = canvas.toDataURL("image/png");
  
    try {
      const response = await fetch("http://localhost:5000/save-report-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.username,
          imageData,
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        alert("✅ Report exported and saved!");
        console.log("Saved URL:", result.url);
      } else {
        console.error("Error saving report:", result.error);
      }
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };  

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 bg-[#ffffff] min-h-screen">
      {upcomingTask && (
        <ReminderModal
          task={upcomingTask}
          onClose={handleModalClose}
          onAction={handleTaskAction}
        />
      )}

      <div className="bg-[#9ACBD0] rounded-2xl shadow-lg p-8 space-y-10">
        <h1 className="text-4xl font-extrabold text-[#006A71] text-center">
          Patient Dashboard
        </h1>

        {/* Patient Overview */}
        <section>
          <h2 className="text-2xl font-bold text-[#006A71] mb-4">Patient Overview</h2>
          <div className="bg-[#ffffff] p-6 rounded-xl space-y-2">
            <p>
              <strong>Stage of Dementia:</strong> {patientData.stage_of_dementia || "N/A"}
            </p>
            <p>
              <strong>Precautions:</strong> {patientData.precautions || "N/A"}
            </p>
            <p>
              <strong>Recommended Sleeping Hours:</strong> {patientData.recommended_sleeping_hours || "N/A"} hours
            </p>
          </div>
        </section>

        <div className="text-right">
          <button
            onClick={() => {
              setEditedData(patientData);
              setIsEditing(!isEditing);
            }}
            className="bg-[#006A71] text-white px-5 py-2 rounded-xl hover:bg-[#48A6A7]"
          >
            {isEditing ? "Cancel Edit" : "Edit Tracking Details"}
          </button>
        </div>

        {/* Medication Schedule */}
        <section>
          <h2 className="text-2xl font-bold text-[#006A71] mb-4">Medication Schedule</h2>
          <div className="grid gap-4">
            {(isEditing ? editedData.medications : patientData.medications).map((med, index) => (
              <div key={index} className="bg-[#ffffff] p-4 rounded-xl space-y-2">
                {isEditing ? (
                  <>
                    <input type="text" value={med.medication_name} onChange={(e) => handleInputChange(e, index, "medication_name", "medication")} className="w-full p-2 border rounded" placeholder="Medication Name" />
                    <input type="text" value={med.dosage} onChange={(e) => handleInputChange(e, index, "dosage", "medication")} className="w-full p-2 border rounded" placeholder="Dosage" />
                    <input type="time" value={med.scheduled_time} onChange={(e) => handleInputChange(e, index, "scheduled_time", "medication")} className="w-full p-2 border rounded" />
                    <input type="text" value={med.frequency} onChange={(e) => handleInputChange(e, index, "frequency", "medication")} className="w-full p-2 border rounded" placeholder="Frequency" />
                    <button onClick={() => removeItem(index, "medication")} className="text-red-600 hover:underline">Remove</button>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {med.medication_name}</p>
                    <p><strong>Dosage:</strong> {med.dosage}</p>
                    <p><strong>Time:</strong> {med.scheduled_time}</p>
                    <p><strong>Frequency:</strong> {med.frequency}</p>
                  </>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={() => addItem("medication")} className="bg-[#48A6A7] text-white px-4 py-2 rounded-lg hover:bg-[#006A71]">
                + Add Medication
              </button>
            )}
          </div>
        </section>

        {/* Daily Routines */}
        <section>
          <h2 className="text-2xl font-bold text-[#006A71] mb-4">Daily Routine Schedule</h2>
          <div className="grid gap-4">
            {(isEditing ? editedData.daily_routines : patientData.daily_routines).map((routine, index) => (
              <div key={index} className="bg-[#ffffff] p-4 rounded-xl space-y-2">
                {isEditing ? (
                  <>
                    <input type="text" value={routine.routine_name} onChange={(e) => handleInputChange(e, index, "routine_name", "routine")} className="w-full p-2 border rounded" placeholder="Routine Name" />
                    <input type="time" value={routine.scheduled_time} onChange={(e) => handleInputChange(e, index, "scheduled_time", "routine")} className="w-full p-2 border rounded" />
                    <input type="text" value={routine.frequency} onChange={(e) => handleInputChange(e, index, "frequency", "routine")} className="w-full p-2 border rounded" placeholder="Frequency" />
                    <button onClick={() => removeItem(index, "routine")} className="text-red-600 hover:underline">Remove</button>
                  </>
                ) : (
                  <>
                    <p><strong>Routine:</strong> {routine.routine_name}</p>
                    <p><strong>Time:</strong> {routine.scheduled_time}</p>
                    <p><strong>Frequency:</strong> {routine.frequency}</p>
                  </>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={() => addItem("routine")} className="bg-[#48A6A7] text-white px-4 py-2 rounded-lg hover:bg-[#006A71]">
                + Add Routine
              </button>
            )}
          </div>
        </section>

        {isEditing && (
          <div className="text-right">
            <button onClick={saveChanges} className="bg-[#006A71] text-white px-5 py-2 rounded-xl hover:bg-[#48A6A7]">
              Save Changes
            </button>
          </div>
        )}

        {/* Sleep Tracker */}
        <section>
          <h2 className="text-2xl font-bold text-[#006A71] mb-4">Daily Sleep Tracker</h2>
          <div className="bg-[#ffffff] p-6 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Slept Today</label>
            <input type="number" min="0" max="24" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} className="w-full p-2 border rounded mb-4" />
            <button onClick={logSleepData} className="bg-[#006A71] text-white px-4 py-2 rounded-lg hover:bg-[#48A6A7]">
              Submit Sleep Data
            </button>
          </div>
        </section>

        {/* Weekly Report */}
        <section>
          <h2 className="text-2xl font-bold text-[#006A71] mb-4">Weekly Activity & Sleep Report</h2>
          <div className="flex flex-col md:flex-row gap-4">
          <button onClick={generateWeeklyReport} className="bg-[#48A6A7] text-white px-4 py-2 rounded-lg hover:bg-[#006A71]">
            Generate Report
          </button>
          {reportData && (
            <button onClick={exportReportAsImage} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Export as PNG
            </button>
          )}
        </div>


        {reportData && (
  <div id="weekly-report" className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-lg font-semibold text-[#006A71] mb-4">Medication Task Completion</h4>
      <Pie data={reportData.medicationTaskCompletionChart} />
      {reportData.missingMedications?.length > 0 && (
        <div className="mt-4 text-red-600">
          <strong>Missed Medications:</strong>
          <ul className="list-disc ml-5">
            {reportData.missingMedications.map((med, i) => (
              <li key={i}>{med}</li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-lg font-semibold text-[#006A71] mb-4">Routine Task Completion</h4>
      <Pie data={reportData.routineTaskCompletionChart} />
      {reportData.missingRoutines?.length > 0 && (
        <div className="mt-4 text-red-600">
          <strong>Missed Routines:</strong>
          <ul className="list-disc ml-5">
            {reportData.missingRoutines.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
      <h4 className="text-lg font-semibold text-[#006A71] mb-4">Sleep Quality</h4>
      <Bar data={reportData.sleepChart} />
    </div>
  </div>
)}

        </section>
      </div>
    </div>
  );
};

export default Dashboard;
