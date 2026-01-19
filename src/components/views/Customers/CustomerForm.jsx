import { useState } from 'react';

const InputField = ({ label, placeholder, value, onChange, type = "text", required = false }) => (
  <div className="flex flex-col">
    {label && <label className="mb-1 font-medium">{label}{required && <span className="text-red-500">*</span>}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    gstin: '',
    email: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, companyName, email } = formData;
    if (!firstName || !lastName || !companyName || !email) {
      setError('Please fill in all required fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setSuccess('Customer saved successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        gstin: '',
        email: ''
      });
    }
  };

  return (
    <div className="max-w-3xl p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">New Customer</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          name="firstName"
        />
        <InputField
          label="Last Name"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          name="lastName"
        />
        <div className="md:col-span-2">
          <InputField
            label="Company Name"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            name="companyName"
          />
        </div>
        <div className="md:col-span-2">
          <InputField
            label="GSTIN"
            placeholder="GSTIN"
            value={formData.gstin}
            onChange={handleChange}
            name="gstin"
          />
        </div>
        <div className="md:col-span-2">
          <InputField
            label="Email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            name="email"
          />
        </div>

        {error && <p className="text-red-500 md:col-span-2">{error}</p>}
        {success && <p className="text-green-500 md:col-span-2">{success}</p>}

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
