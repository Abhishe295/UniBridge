import { useEffect, useState } from "react";
import { useBookingStore } from "../../store/bookingStore";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Briefcase, 
  ArrowRight, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Search
} from "lucide-react";
import toast from "react-hot-toast";

const BookingHistoryPage = () => {
  const bookingStore = useBookingStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await bookingStore.fetchUserBookings();
      } catch (error) {
        toast.error("Failed to load booking history");
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
          icon: <AlertCircle className="w-5 h-5" />,
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

  const filteredBookings = bookingStore.bookings
    .filter((b) => {
      if (filter === "all") return true;
      return b.status === filter;
    })
    .filter((b) => {
      if (!searchTerm) return true;
      return b.category.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const stats = {
    all: bookingStore.bookings.length,
    waiting: bookingStore.bookings.filter(b => b.status === "waiting").length,
    accepted: bookingStore.bookings.filter(b => b.status === "accepted").length,
    completed: bookingStore.bookings.filter(b => b.status === "completed").length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Booking History
          </h1>
          <p className="text-base-content/60 mt-1">View and manage all your bookings</p>
        </div>
        <div className="badge badge-lg badge-primary gap-2">
          <Briefcase className="w-4 h-4" />
          {filteredBookings.length} {filteredBookings.length === 1 ? "Booking" : "Bookings"}
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
                placeholder="Search by category..."
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
                <option value="all">All ({stats.all})</option>
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
                : "Start by booking a service from the dashboard"}
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
          {filteredBookings.map((b) => {
            const statusConfig = getStatusConfig(b.status);
            return (
              <div
                key={b._id}
                className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl cursor-pointer group transition-all duration-300 hover:border-primary/50"
                onClick={() => navigate(`/user/booking/${b._id}`)}
              >
                <div className="card-body p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${statusConfig.bgColor}`}>
                        <Briefcase className={`w-6 h-6 ${statusConfig.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg capitalize group-hover:text-primary transition-colors">
                          {b.category}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`badge ${statusConfig.badgeClass} gap-1`}>
                            {statusConfig.icon}
                            <span className="capitalize">{b.status}</span>
                          </span>
                          {b.helper && (
                            <span className="badge badge-outline gap-1">
                              Helper: {b.helper.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                          <Calendar className="w-4 h-4" />
                          {new Date(b.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-base-content/60 hidden sm:inline">
                        View Details
                      </span>
                      <ArrowRight className="w-5 h-5 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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

export default BookingHistoryPage;