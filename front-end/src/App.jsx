import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function CalendarApp() {
  const [customers, setCustomers] = useState([]);
  const [customerNumber, setCustomerNumber] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch customer data on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5005/load")
      .then((response) => {
        console.log("Customer data:", response.data); // Log the data to check its structure
        setCustomers(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      });
  }, []);

  // Function to handle calendar issue
  const issueCalendar = (customerNum) => {
    const updatedCustomers = customers.map((customer) => {
      if (customer.cust_num === customerNum) {
        return { ...customer, calender: "Yes" };
      }
      return customer;
    });
    setCustomers(updatedCustomers);

    // Send the update request to the backend
    axios
      .post("http://localhost:5005/update", updatedCustomers)
      .then(() => {
        setMessage(`Calendar issued successfully for customer ${customerNum}!`);
      })
      .catch((err) => {
        console.error("Error issuing calendar:", err);
        setMessage("Failed to issue calendar.");
      });
  };

  // Function to remove calendar issue
  const removeCalendar = (customerNum) => {
    const updatedCustomers = customers.map((customer) => {
      if (customer.cust_num === customerNum) {
        return { ...customer, calender: "No" };
      }
      return customer;
    });
    setCustomers(updatedCustomers);

    // Send the update request to the backend
    axios
      .post("http://localhost:5005/update", updatedCustomers)
      .then(() => {
        setMessage(
          `Calendar removed successfully for customer ${customerNum}!`
        );
      })
      .catch((err) => {
        console.error("Error removing calendar:", err);
        setMessage("Failed to remove calendar.");
      });
  };

  // Function to check the calendar status
  const checkCalendar = (customerNum) => {
    const num = parseInt(customerNum, 10); // Convert customer number to an integer
    if (isNaN(num)) {
      alert("Please enter a valid customer number.");
      return;
    }

    // Search for the customer by customer number
    const customer = customers.find((customer) => customer.cust_num === num);
    if (customer) {
      alert(`Calendar status for customer ${num}: ${customer.calender}`);
    } else {
      alert("Customer not found!");
    }
  };

  return (
    <div className="calendar-app">
      <h1 className="title">Customer Calendar Management</h1>
      <div className="form-container">
        <h3>Enter Customer Number</h3>
        <input
          type="number"
          placeholder="Enter customer number"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
          className="customer-input"
        />
        <div className="button-container">
          <button
            className="action-button"
            onClick={() => checkCalendar(customerNumber)}
          >
            Check Calendar
          </button>
          <button
            className="action-button"
            onClick={() => issueCalendar(parseInt(customerNumber, 10))}
          >
            Issue Calendar
          </button>
          <button
            className="action-button remove-button"
            onClick={() => removeCalendar(parseInt(customerNumber, 10))}
          >
            Remove Calendar
          </button>
        </div>
      </div>
      <div className="message-container">
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="customer-list">
        <h3>Customer List</h3>
        <ul>
          {customers.map((customer) => (
            <li key={customer.cust_num} className="customer-item">
              Customer: {customer.cust_num} | Calendar: {customer.calender}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarApp;
