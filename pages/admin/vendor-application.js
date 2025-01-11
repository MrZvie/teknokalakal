import Layout from "@/components/Layout";
import LoadingIndicator from "@/components/LoadingIndicator";
import axios from "axios";
import { useEffect, useState } from "react";

export default function VendorApplication() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/admin/vendor-application");
      setApplications(response.data);
    } catch (error) {
      setError("Failed to fetch applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(`/api/admin/vendor-application/${id}`, { status: newStatus });
      if (response.status === 200) {
        // Close modal after status update
        setSelectedApp(null);
        fetchApplications();  // Refresh the applications to reflect status change
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data?.message || error.message);
      alert("Failed to update the vendor status. Please try again.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status.toLowerCase() === statusFilter;
  }).filter((app) =>
    app.businessInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg py-2 px-6">
        <h2 className="text-base sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-2">
          Vendors List
        </h2>

        {/* Filter and Search */}
        <div className="flex flex-wrap w-auto gap-4 mb-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by business name"
            className="px-4 py-2 border rounded-lg w-full md:w-auto"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-auto"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-left text-sm text-gray-600">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-800">
                  Vendor Name
                </th>
                <th className="px-6 py-3 font-medium text-gray-800 hidden sm:table-cell">
                  Email
                </th>
                <th className="px-6 py-3 font-medium text-gray-800 hidden sm:table-cell">
                  Status
                </th>
                <th className="px-6 py-3 font-medium text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-600">
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : paginatedApplications.length > 0 ? (
                paginatedApplications.map((app) => (
                  <tr className="border-b hover:bg-gray-50" key={app._id}>
                    <td className="px-6 py-4">{app.businessInfo.name}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {app.businessInfo.email}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          app.status === "approved"
                            ? "bg-green-500"
                            : app.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-blue-600 hover:underline"
                        title="View Details"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-600">
                    No applications available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredApplications.length > itemsPerPage && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of{" "}
              {Math.ceil(filteredApplications.length / itemsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(filteredApplications.length / itemsPerPage),
                    currentPage + 1
                  )
                )
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal for Viewing Application Details */}
      {selectedApp && (
        <div className="fixed inset-0 text-sm md:text-base bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:w-11/12 md:w-8/12">
            <h3 className="text-xl font-semibold mb-4">
              Vendor Application Details
            </h3>
            <div className="mb-2 md:mb-3">
              <strong>Business Name:</strong> {selectedApp.businessInfo.name}
            </div>
            <div className="mb-2 md:mb-3">
              <strong>Email:</strong> {selectedApp.businessInfo.email}
            </div>
            <div className="mb-2 md:mb-3">
              <strong>Phone:</strong> {selectedApp.businessInfo.phone}
            </div>
            <div className="mb-2 md:mb-3">
              <strong>Address:</strong>
              <div className="flex flex-wrap gap-2">
                <span>{selectedApp.businessInfo.address.streetAddress},</span>
                <span>{selectedApp.businessInfo.address.barangay},</span>
                <span>{selectedApp.businessInfo.address.municipality},</span>
                <span>{selectedApp.businessInfo.address.province},</span>
                <span>{selectedApp.businessInfo.address.postalCode}</span>
              </div>
            </div>

            <div className="mb-2 md:mb-3">
              <strong>Certification:</strong>
              <div className="mt-2 flex flex-wrap gap-4">
                {selectedApp.certifications.length > 0 &&
                  selectedApp.certifications.map((cert, index) =>
                    cert.link ? (
                      <div
                        key={cert._id || index}
                        className="relative group cursor-pointer w-20 h-20 sm:w-24 sm:h-24 "
                      >
                        <img
                          src={cert.link}
                          alt={`Certification ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg transition-transform duration-200 ease-in-out group-hover:scale-110"
                          onClick={() => openImageModal(cert.link)}
                        />
                      </div>
                    ) : null
                  )}
              </div>
            </div>

            {/* Status Update in Modal */}
            <div className="mb-2">
              <strong>Status:</strong>
              <select
                value={selectedApp.status}
                onChange={(e) =>
                  handleStatusChange(selectedApp._id, e.target.value)
                }
                className="px-4 py-2 mt-2 border rounded-lg w-full"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl">
            <img
              src={selectedImage}
              alt="Certification"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setImageModalOpen(false)}
              className="mt-4 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
