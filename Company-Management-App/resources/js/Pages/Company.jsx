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
    logo: null, 
    website: ""
  });
  const [isEditing, setIsEditing] = useState(false); 
  const [showForm, setShowForm] = useState(false); 
  const [logoPreview, setLogoPreview] = useState(null); 

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
      const response = await axios.get("/api/companies", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      const result = response.data.companies?.data || [];
      setCompanies(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies", error);
      setError(error); 
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0]; 
      setFormData({
        ...formData,
        logo: file 
      });

      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl); // Set the preview URL
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission for creating or updating a company
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo); // Append logo file
    }
    formDataToSend.append('website', formData.website);

    try {
      if (isEditing) {
        // Update company
        await axios.post(
          `/api/companies/edit/${formData.id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data', 
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Company updated successfully");
      } else {
        // Create company
        await axios.post(
          "/api/companies/create",
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data', 
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Company created successfully");
      }
    } catch (error) {
      console.error("Error processing request", error);
    }

    // Reset form and refresh the company list
    setFormData({
      id: null,
      name: "",
      email: "",
      logo: null,
      website: ""
    });
    setLogoPreview(null); // Reset logo preview
    setShowForm(false);
    setIsEditing(false);
    fetchCompanies();
  };

  // Handle company edit
  const handleEdit = (company) => {
    setFormData({
      id: company.id,
      name: company.name || "", 
      email: company.email || "", 
      logo: null, // Reset logo in case of edit
      website: company.website || "" 
    });  
    setLogoPreview(company.logo || null); // Set logo preview if editing
    setIsEditing(true); // Set editing mode
    setShowForm(true); // Show the form
  };

  // Handle company delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`/api/companies/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Company deleted successfully");
        fetchCompanies(); 
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
      logo: null,
      website: ""
    });
    setLogoPreview(null); 
    setIsEditing(false); 
    setShowForm(true); 
  };

  return (
    <div className="wrapper">
      <div className="title-wrapper">
        <h1>Company Management</h1>
        <button className="btn-green" onClick={handleNewCompany}>Add New Company</button>
      </div>

      {/* Form for creating/editing company */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form-wrapper">
          <h1>Create/Edit</h1>
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
            type="file" // File input for logo
            name="logo"
            onChange={handleChange}
            accept="image/*" // Only accept image files
          />
          {/* Preview the uploaded logo */}
          {logoPreview && (
            <div>
              <h3>Logo Preview:</h3>
              <img src={logoPreview} alt="Logo Preview" width="100" />
            </div>
          )}
          <input
            type="text"
            name="website"
            placeholder="Company Website"
            value={formData.website}
            onChange={handleChange}
          />
          <div className="form-btn-wrapper">
            <button type="submit" className="btn-green">{isEditing ? "Update" : "Create"} Company</button>
            <button type="button"  className="btn-red" onClick={() => setShowForm(false)}>Cancel</button>

          </div>
        </form>
      )}
      
      <ul>
        {companies.map((item, index) => (
          <li key={item.id || index} className="card-wrapper">
            <p><strong>Logo:</strong> <img src={item.logo} alt={`${item.name} logo`} width="50" /></p>
            <div className="card-container">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Email:</strong> {item.email}</p>

            </div>
            <p><strong>Website:</strong> <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a></p>
            <div className="card-container">
              <button className="btn-green" onClick={() => handleEdit(item)}>Edit</button> 
              <button className="btn-red" onClick={() => handleDelete(item.id)}>Delete</button> 

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Company;
