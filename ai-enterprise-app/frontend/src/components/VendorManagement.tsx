import { useEffect, useState } from "react";

interface Vendor {
  id: number;
  name: string;
  category: string;
  score: number;
  lead_time_days: number;
  compliance_status: string;
}

export default function VendorManagement() {

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const loadVendors = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/procurement/vendors"
      );

      const data = await response.json();
      setVendors(data);

    } catch (error) {
      console.error(error);
      alert("Unable to load vendors.");
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const addVendor = async () => {

    if (name.trim() === "" || category.trim() === "") {
      alert("Please enter Vendor Name and Category.");
      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8001/procurement/vendors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            category: category,
            score: 90,
            lead_time_days: 7,
            compliance_status: "review"
          })
        }
      );

      if (!response.ok) {
        alert("Failed to add vendor.");
        return;
      }

      alert("Vendor added successfully.");

      setName("");
      setCategory("");

      loadVendors();

    } catch (error) {
      console.error(error);
      alert("Server error.");
    }

  };

  return (

    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-5">
        Vendor Management
      </h2>

      <div className="flex gap-3 mb-6">

        <input
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={addVendor}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Add Vendor
        </button>

      </div>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Lead Time</th>
            <th className="p-2 border">Status</th>
          </tr>

        </thead>

        <tbody>

          {vendors.map((vendor) => (

            <tr key={vendor.id}>

              <td className="p-2 border">
                {vendor.name}
              </td>

              <td className="p-2 border">
                {vendor.category}
              </td>

              <td className="p-2 border">
                {vendor.score}
              </td>

              <td className="p-2 border">
                {vendor.lead_time_days} days
              </td>

              <td className="p-2 border">
                {vendor.compliance_status}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}