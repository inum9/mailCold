import { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    recipientEmail: "",
    recipientName: "",
    company: "",
  });
  const [resume, setResume] = useState(null);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return alert("Please upload a resume (PDF)");

    const formData = new FormData();
    formData.append("recipientEmail", form.recipientEmail);
    formData.append("recipientName", form.recipientName);
    formData.append("company", form.company);
    formData.append("resume", resume);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/mail/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      alert("Error sending email");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>📧 Cold Email Sender</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="recipientEmail"
          placeholder="Recipient Email"
          value={form.recipientEmail}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="text"
          name="recipientName"
          placeholder="Recipient Name"
          value={form.recipientName}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        /><br /><br />

        <button type="submit">Send Email</button>
      </form>

      {response && (
        <div style={{ marginTop: "2rem", backgroundColor: "#yellow", padding: "1rem" }}>
          <h3>✅ Email Sent!</h3>
          <p><strong>To:</strong> {response.data.recipientEmail}</p>
          <p><strong>Status:</strong> {response.data.status}</p>
          <p><strong>Message:</strong> {response.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;

