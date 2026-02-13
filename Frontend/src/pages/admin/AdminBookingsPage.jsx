import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { 
  Briefcase, 
  Calendar, 
  User, 
  Wrench,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

const AdminBookingsPage = () => {
  const { bookings, fetchBookings } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchBookings();
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case "waiting":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-warning",
          bgColor: "bg-warning/10",
          badgeClass: "badge-warning"
        };
      case "accepted":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "text-info",
          bgColor: "bg-info/10",
          badgeClass: "badge-info"
        };
      case "reached":
        return {
          icon: <MapPin className="w-5 h-5" />,
          color: "text-secondary",
          bgColor: "bg-secondary/10",
          badgeClass: "badge-secondary"
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "text-success",
          bgColor: "bg-success/10",
          badgeClass: "badge-success"
        };
      default:
        return {
          icon: <Briefcase className="w-5 h-5" />,
          color: "text-base-content",
          bgColor: "bg-base-200",
          badgeClass: "badge-ghost"
        };
    }
  };

  const filteredBookings = bookings
    .filter((b) => {
      if (filter === "all") return true;
      return b.status === filter;
    })
    .filter((b) => {
      if (!searchTerm) return true;
      return (
        b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.helper?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const stats = {
    all: bookings.length,
    waiting: bookings.filter(b => b.status === "waiting").length,
    accepted: bookings.filter(b => b.status === "accepted").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            All Bookings
          </h1>
          <p className="text-base-content/60 mt-1">Manage and monitor all platform bookings</p>
        </div>
        <div className="badge badge-lg badge-accent gap-2">
          <Sparkles className="w-4 h-4" />
          Admin Panel
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Total</div>
            <div className="text-2xl font-bold text-primary">{stats.all}</div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Waiting</div>
            <div className="text-2xl font-bold text-warning">{stats.waiting}</div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Active</div>
            <div className="text-2xl font-bold text-info">{stats.accepted}</div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Completed</div>
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Search by category, user, or helper..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-base-content/60" />
              <select
                className="select select-bordered w-full sm:w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status ({stats.all})</option>
                <option value="waiting">Waiting ({stats.waiting})</option>
                <option value="accepted">Accepted ({stats.accepted})</option>
                <option value="completed">Completed ({stats.completed})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 mt-4">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body items-center justify-center py-12">
            <Briefcase className="w-16 h-16 text-base-content/20 mb-3" />
            <p className="text-lg font-semibold text-base-content/60">
              {searchTerm || filter !== "all" ? "No bookings found" : "No bookings yet"}
            </p>
            <p className="text-sm text-base-content/40">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your filters" 
                : "Bookings will appear here"}
            </p>
            {(searchTerm || filter !== "all") && (
              <button 
                className="btn btn-primary btn-sm mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            return (
              <div
                key={booking._id}
                className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="card-body p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section - Booking Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${statusConfig.bgColor}`}>
                        <Briefcase className={`w-6 h-6 ${statusConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg capitalize mb-2">
                          {booking.category}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {/* User */}
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-base-content/60 flex-shrink-0" />
                            <span className="text-sm truncate">
                              <span className="text-base-content/60">User:</span>{" "}
                              <span className="font-medium">{booking.user?.name || "N/A"}</span>
                            </span>
                          </div>
                          {/* Helper */}
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-base-content/60 flex-shrink-0" />
                            <span className="text-sm truncate">
                              <span className="text-base-content/60">Helper:</span>{" "}
                              <span className="font-medium">{booking.helper?.name || "Not assigned"}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Status */}
                    <div className="flex items-center gap-3">
                      <span className={`badge ${statusConfig.badgeClass} gap-2 px-4 py-3`}>
                        {statusConfig.icon}
                        <span className="capitalize font-semibold">{booking.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;