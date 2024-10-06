import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    employee_id: '',
    status: 'pending', // Set a default status
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/task',{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      }); // Adjust based on your endpoint
      const result = response.data.tasks?.data || [];
      setTasks(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees',{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      }); // Adjust based on your endpoint
      const result = response.data.companies?.data || [];
      setEmployees(result);
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // Function to handle editing a task
  const handleEdit = (task) => {
    setFormData({
      id: task.id,
      name: task.name,
      description: task.description,
      employee_id: task.employee_id,
      status: task.status,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // Function to handle deleting a task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/task/delete/${id}`); // Adjust based on your endpoint
      fetchTasks(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/task/edit/ ${formData.id}`, formData,{
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        }); // Adjust based on your endpoint
        alert('Task updated successfully');
      } else {
        await axios.post('/api/task/create', formData,{
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        }); // Adjust based on your endpoint
        alert('Task created successfully');
      }
      fetchTasks(); // Refresh the list after submit
      setShowForm(false);
      setFormData({
        id: null,
        name: '',
        description: '',
        employee_id: '',
        status: 'pending',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="wrapper">
      <h1>Task Management</h1>
      <button onClick={() => setShowForm(true)}>Add Task</button>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <select
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.first_name} {employee.last_name}
              </option>
            ))}
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
          >
            <option value="done">Done</option>
            <option value="started">Started</option>
            <option value="new">New</option>
          </select>
          <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <p><strong>Name:</strong> {task.name}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Assigned Employee:</strong> {task.employee?.first_name} {task.employee?.last_name}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Task
