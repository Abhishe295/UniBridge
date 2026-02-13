import { useEffect, useState } from "react";
import { useHelperStore } from "../../store/helperStore";
import { useBookingStore } from "../../store/bookingStore";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  Briefcase, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Power,
  Calendar,
  ArrowRight,
  Sparkles,
  Award
} from "lucide-react";
import toast from "react-hot-toast";

const HelperDashboard = () => {
  const helperStore = useHelperStore();
  const bookingStore = useBookingStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          helperStore.fetchHelperDashboard(),
          bookingStore.fetchHelperBookings()
        ]);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    setIsToggling(true);
    try {
      await helperStore.toggleAvailability();
      toast.success("Availability updated successfully!");
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "waiting":
        return {
          icon: <Clock className="w-4 h-4" />,
          badgeClass: "badge-warning"
        };
      case "accepted":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          badgeClass: "badge-info"
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          badgeClass: "badge-success"
        };
      default:
        return {
          icon: <Briefcase className="w-4 h-4" />,
          badgeClass: "badge-ghost"
        };
    }
  };

  const totalBookings = bookingStore.bookings.length;
  const activeBookings = bookingStore.bookings.filter(b => b.status !== "completed").length;
  const completedBookings = bookingStore.bookings.filter(b => b.status === "completed").length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Helper Dashboard
          </h1>
          <p className="text-base-content/60 mt-1">Manage your bookings and earnings</p>
        </div>
        <div className="badge badge-lg badge-primary gap-2">
          <Sparkles className="w-4 h-4" />
          Helper Panel
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Earnings */}
        <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-base-content/70">Total Earnings</div>
                <div className="text-2xl sm:text-3xl font-bold text-success mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    `$${helperStore.stats?.earnings || 0}`
                  )}
                </div>
              </div>
              <div className="p-3 bg-success/20 rounded-full">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-base-content/70">Total Bookings</div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    totalBookings
                  )}
                </div>
              </div>
              <div className="p-3 bg-primary/20 rounded-full">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-base-content/70">Active Bookings</div>
                <div className="text-2xl sm:text-3xl font-bold text-warning mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    activeBookings
                  )}
                </div>
              </div>
              <div className="p-3 bg-warning/20 rounded-full">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="card bg-gradient-to-br from-info/10 to-info/5 border border-info/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-base-content/70">Completed</div>
                <div className="text-2xl sm:text-3xl font-bold text-info mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    completedBookings
                  )}
                </div>
              </div>
              <div className="p-3 bg-info/20 rounded-full">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-info" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Power className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Availability Status</h3>
                <p className="text-sm text-base-content/60">
                  Toggle to control whether you receive new bookings
                </p>
              </div>
            </div>
            <button
              className={`btn gap-2 ${helperStore.stats?.isAvailable ? 'btn-success' : 'btn-error'} min-w-[140px]`}
              onClick={handleToggleAvailability}
              disabled={isToggling}
            >
              {isToggling ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  {helperStore.stats?.isAvailable ? 'Available' : 'Unavailable'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">Recent Bookings</h2>
        </div>

        {isLoading ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-2">Loading bookings...</p>
            </div>
          </div>
        ) : bookingStore.bookings.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <Briefcase className="w-16 h-16 text-base-content/20 mb-3" />
              <p className="text-base-content/60">No bookings yet</p>
              <p className="text-sm text-base-content/40">New bookings will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingStore.bookings.slice(0, 5).map((b) => {
              const statusConfig = getStatusConfig(b.status);
              return (
                <div
                  key={b._id}
                  className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl cursor-pointer group transition-all duration-300 hover:border-primary/50"
                  onClick={() => navigate(`/helper/booking/${b._id}`)}
                >
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold capitalize text-base sm:text-lg group-hover:text-primary transition-colors">
                            {b.category}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`badge badge-sm ${statusConfig.badgeClass} gap-1`}>
                              {statusConfig.icon}
                              <span className="capitalize">{b.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-base-content/60">Booked on</div>
                          <div className="text-sm font-medium">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </div>
                        </div>
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
    </div>
  );
};

export default HelperDashboard;