import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Company = () => {

  const [companies, setCompanies] = useState([]); // Ensure initial state is an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    logo: "",
    website: ""
  });
  const [isEditing, setIsEditing] = useState(false); // Flag to handle edit mode
  const [showForm, setShowForm] = useState(false); // Flag to toggle form visibility

  useEffect(() => {
    fetchCompanies();
  }, []);

  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  if (!token) {
    setError(new Error('No authentication token found'));
    setLoading(false);
      return;
  }
  const fetchCompanies = async () => {
    try {
      const response = await axios.get("/api/companies",{
        headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
        },

      });
      const result = response.data.companies?.data || [];
      setCompanies(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies", error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission for creating or updating a company
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update company
      try {
        await axios.put(
          `/api/companies/edit/${formData.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        alert("Company updated successfully");
      } catch (error) {
        console.error("Error updating company", error);
      }
    } else {
      // Create company
      try {
        await axios.post(
          "/api/companies/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        alert("Company created successfully");
      } catch (error) {
        console.error("Error creating company", error);
      }
    }

    // Reset form and refresh the company list
    setFormData({
      id: null,
      name: "",
      email: "",
      logo: "",
      website: ""
    });
    setShowForm(false);
    setIsEditing(false);
    fetchCompanies();
  };

  // Handle company edit
  const handleEdit = (company) => {
    console.log(company.id)
    setFormData({
      id: company.id,
      name: company.name || "", 
      email: company.email || "", 
      logo: company.logo || "", 
      website: company.website || "" 
    });  
    setIsEditing(true); // Set editing mode
    setShowForm(true); // Show the form
  };

  // Handle company delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`/api/companies/delete/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        alert("Company deleted successfully");
        fetchCompanies(); // Refresh the company list
      } catch (error) {
        console.error("Error deleting company", error);
      }
    }
  };

  // Handle new company button click
  const handleNewCompany = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      logo: "",
      website: ""
    });
    setIsEditing(false); // Set to create mode
    setShowForm(true); // Show the form
  };


  return (
    <div className="wrapper">
    <h1>Companies</h1>
    <h1>Company Management</h1>
      <button onClick={handleNewCompany}>Add New Company</button>

      {/* Form for creating/editing company */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Company Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="logo"
            placeholder="Company Logo URL"
            value={formData.logo}
            onChange={handleChange}
          />
          <input
            type="text"
            name="website"
            placeholder="Company Website"
            value={formData.website}
            onChange={handleChange}
          />
          <button type="submit">{isEditing ? "Update" : "Create"} Company</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    <ul>
        {companies.map((item, index) => (
          <li key={item.id || index}>
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Logo:</strong> <img src={item.logo} alt={`${item.name} logo`} width="50" /></p>
            <p><strong>Website:</strong> <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a></p>
            <button onClick={() => handleEdit(item)}>Edit</button> 
            <button onClick={() => handleDelete(item.id)}>Delete</button> 
          </li>
        ))}
      </ul>
  </div>
  )
}

export default Company
