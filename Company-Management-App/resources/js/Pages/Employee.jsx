import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    first_name: '',
    last_name: '',
    company_id: '',
    email: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [companies, setCompanies] = useState([]); // Assuming you have a list of companies for the dropdown
  const token = localStorage.getItem('token');
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

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies',{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      }); // Adjust based on your endpoint
      const result = response.data.companies?.data || [];
      setCompanies(result);
    } catch (error) {
      console.error('Error fetching companies', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchCompanies();
  }, []);

  const handleEdit = (employee) => {
    setFormData({
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      company_id: employee.company_id,
      email: employee.email,
      phone: employee.phone,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/employees/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`, 
      },
      }); 
      fetchEmployees(); 
    } catch (error) {
      console.error('Error deleting employee', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/employees/edit/${formData.id}`, formData,{
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        }); // Adjust based on your endpoint
        alert('Employee updated successfully');
      } else {
        await axios.post('/api/employees/create', formData,{
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        }); // Adjust based on your endpoint
        alert('Employee created successfully');
      }
      fetchEmployees(); // Refresh the list after submit
      setShowForm(false);
      setFormData({
        id: null,
        first_name: '',
        last_name: '',
        company_id: '',
        email: '',
        phone: '',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="wrapper">
      <h1>Employee Management</h1>
      <button onClick={() => setShowForm(true)}>Add Employee</button>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
          <select
            value={formData.company_id}
            onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
            required
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <p><strong>First Name:</strong> {employee.first_name}</p>
            <p><strong>Last Name:</strong> {employee.last_name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Company:</strong> {employee.company?.name}</p> 
            
            <strong>Tasks:</strong>
            <ul>
              {employee.tasks?.map((task) => (
                <li key={task.id}>{task.name}</li> 
              ))}
            </ul>
            
            <button onClick={() => handleEdit(employee)}>Edit</button>
            <button onClick={() => handleDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Employee
