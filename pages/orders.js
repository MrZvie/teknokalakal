import Layout from "@/components/Layout";
import LoadingIndicator from "@/components/LoadingIndicator";
import axios from "axios";
import { useEffect, useState } from "react";
import swal from "sweetalert2";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    axios.get('api/orders').then(response => {
      console.log("Received data:", response.data);
      setOrders(response.data);
    });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-200 text-red-900';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'insufficient_funds':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price / 100);
  };

  const calculateTotalAmount = (order) => {
    return order.line_items.reduce((total, item) => total + item.amount * item.quantity, 0);
  };

  const handleViewDetails = (order) => {
    swal.fire({
      title: `<h2 class="text-lg font-semibold text-gray-800">Order Details</h2>`,
      html: `
        <div class="text-left max-w-3xl mx-auto p-4 border border-gray-300 overflow-hidden bg-white rounded-lg shadow-lg">
          <p class="text-gray-700"><strong>Reference Number:</strong> ${order.reference_number}</p>
          <p class="text-gray-700"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p class="text-gray-700"><strong>Status:</strong> ${order.status}</p>
          <p class="text-gray-700"><strong>Total:</strong> ${new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(calculateTotalAmount(order) / 100)}
          </p>
  
          <h3 class="text-sm font-semibold mt-4 mb-2 text-gray-700">Order Items</h3>
          
          <div class="overflow-x-auto max-h-[85px]">
            <table class="w-full table-auto text-sm">
              <thead>
                <tr class="bg-gray-100 text-xs md:text-base border-b">
                  <th class="px-2 py-2 text-left text-gray-700">Name</th>
                  <th class="px-2 py-2 text-left text-gray-700">Quantity</th>
                  <th class="px-2 py-2 text-left text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody>
                  ${order.line_items
                    .map(
                      (item) => `
                    <tr class="border-b">
                      <td class="px-2 py-1 text-gray-800">${item.name}</td>
                      <td class="px-2 py-1 text-gray-800">${item.quantity}</td>
                      <td class="px-2 py-1 text-gray-800">${new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(item.amount / 100)}</td>
                    </tr>
                  `
                    )
                    .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      customClass: {
        popup: "rounded-lg shadow-lg max-w-3xl",
      },
    });
  };

  return (
    <Layout>
      <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-800">
        Orders
      </h1>

      {/* Table view for larger screens */}
      <div className="hidden lg:block shadow-lg rounded-lg overflow-hidden border border-gray-200 bg-white">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Reference#
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Recipients
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Products
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    className="border border-gray-300 px-4 py-2 text-blue-600 cursor-pointer"
                    onClick={() => handleViewDetails(order)}
                  >
                    {order.reference_number}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-2 rounded-lg text-[15px] font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium text-sm">
                      {order.name}
                    </div>
                    <div className="text-gray-600 text-xs">{order.email}</div>
                    <div className="text-gray-600 text-xs">{order.phone}</div>
                    <div className="text-gray-600 text-xs mt-1">
                      {order.address.streetAddress}, {order.address.barangay},{" "}
                      {order.address.municipality}, {order.address.province},{" "}
                      {order.address.postalCode}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.line_items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-2 text-sm mb-1"
                      >
                        <span className="font-semibold text-gray-900">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600 text-base">
                      {formatPrice(
                        order.line_items.reduce(
                          (total, item) => total + item.quantity * item.amount,
                          0
                        )
                      )}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  <LoadingIndicator />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for smaller screens */}
      <div className="block lg:hidden space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 onClick={() => handleViewDetails(order)} className="font-semibold text-blue-600 text-sm">
                  {order.reference_number}
                </h2>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-gray-600 text-xs mb-2">
                <strong>Date:</strong> {formatDate(order.createdAt)}
              </div>
              <div className="text-gray-900 font-medium text-sm mb-1">
                {order.name}
              </div>
              <div className="text-gray-600 text-xs">{order.email}</div>
              <div className="text-gray-600 text-xs">{order.phone}</div>
              <div className="text-gray-600 text-xs mt-1">
                {order.address.streetAddress}, {order.address.barangay},{" "}
                {order.address.municipality}, {order.address.province},{" "}
                {order.address.postalCode}
              </div>
              <div className="mt-2 text-gray-700">
                <strong>Products:</strong>
                {order.line_items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-1 text-xs mt-1"
                  >
                    <span className="font-semibold">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 font-semibold text-green-600">
                Total:{" "}
                {formatPrice(
                  order.line_items.reduce(
                    (total, item) => total + item.quantity * item.amount,
                    0
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <LoadingIndicator />
          </div>
        )}
      </div>
    </Layout>
  );
}
