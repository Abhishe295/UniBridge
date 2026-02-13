import { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";

const AdminDashboard = () => {
  const adminStore = useAdminStore();

  useEffect(() => {
    adminStore.fetchStats();
    adminStore.fetchBookings();
  }, []);

  return (
    <div className="space-y-6">

      <div className="border p-4 rounded">
        <div>Total Users: {adminStore.stats?.totalUsers}</div>
        <div>Total Helpers: {adminStore.stats?.totalHelpers}</div>
        <div>Total Bookings: {adminStore.stats?.totalBookings}</div>
      </div>

      <div className="border p-4 rounded">
        <div>All Bookings</div>
        {adminStore.bookings.map((b) => (
          <div key={b._id} className="border p-2 mt-2">
            {b.status}
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;
