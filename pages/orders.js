import Layout from "@/components/Layout";
import LoadingIndicator from "@/components/LoadingIndicator";
import axios from "axios";
import { useEffect, useState } from "react";

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

  return (
    <Layout>
      <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-800">Orders</h1>

      {/* Table view for larger screens */}
      <div className="hidden lg:block shadow-lg rounded-lg overflow-hidden border border-gray-200 bg-white">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Reference#</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Recipients</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Products</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer text-sm">
                      {order.reference_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-2 rounded-lg text-[15px] font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium text-sm">{order.name}</div>
                    <div className="text-gray-600 text-xs">{order.email}</div>
                    <div className="text-gray-600 text-xs">{order.phone}</div>
                    <div className="text-gray-600 text-xs mt-1">
                      {order.address.streetAddress}, {order.address.barangay}, {order.address.municipality}, {order.address.province}, {order.address.postalCode}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.line_items.map(item => (
                      <div key={item._id} className="flex items-center space-x-2 text-sm mb-1">
                        <span className="font-semibold text-gray-900">{item.quantity}x</span>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600 text-base">
                      {formatPrice(order.line_items.reduce((total, item) => total + item.quantity * item.amount, 0))}
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
          orders.map(order => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-blue-600 text-sm">{order.reference_number}</h2>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-gray-600 text-xs mb-2">
                <strong>Date:</strong> {formatDate(order.createdAt)}
              </div>
              <div className="text-gray-900 font-medium text-sm mb-1">{order.name}</div>
              <div className="text-gray-600 text-xs">{order.email}</div>
              <div className="text-gray-600 text-xs">{order.phone}</div>
              <div className="text-gray-600 text-xs mt-1">
                {order.address.streetAddress}, {order.address.barangay}, {order.address.municipality}, {order.address.province}, {order.address.postalCode}
              </div>
              <div className="mt-2 text-gray-700">
                <strong>Products:</strong>
                {order.line_items.map(item => (
                  <div key={item._id} className="flex items-center space-x-1 text-xs mt-1">
                    <span className="font-semibold">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 font-semibold text-green-600">
                Total: {formatPrice(order.line_items.reduce((total, item) => total + item.quantity * item.amount, 0))}
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
