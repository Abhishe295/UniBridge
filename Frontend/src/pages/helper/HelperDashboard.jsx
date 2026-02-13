import { useEffect, useState } from "react";
import { useHelperStore } from "../../store/helperStore";
import { useBookingStore } from "../../store/bookingStore";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  Briefcase, 
  CheckCircle, 
  Clock,
  Power,
  Sparkles,
  Award,
  TrendingUp,
  Zap
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

  const totalBookings = bookingStore.bookings.length;
  const activeBookings = bookingStore.bookings.filter(b => b.status !== "completed").length;
  const completedBookings = bookingStore.bookings.filter(b => b.status === "completed").length;

  const stats = [
    {
      label: "Total Earnings",
      value: isLoading ? null : `$${helperStore.stats?.earnings || 0}`,
      icon: DollarSign,
      color: "success",
      gradient: "from-success/10 to-success/5",
      border: "border-success/20",
      delay: "0s"
    },
    {
      label: "Total Bookings",
      value: isLoading ? null : totalBookings,
      icon: Briefcase,
      color: "primary",
      gradient: "from-primary/10 to-primary/5",
      border: "border-primary/20",
      delay: "0.1s"
    },
    {
      label: "Active Jobs",
      value: isLoading ? null : activeBookings,
      icon: Clock,
      color: "warning",
      gradient: "from-warning/10 to-warning/5",
      border: "border-warning/20",
      delay: "0.2s"
    },
    {
      label: "Completed",
      value: isLoading ? null : completedBookings,
      icon: Award,
      color: "info",
      gradient: "from-info/10 to-info/5",
      border: "border-info/20",
      delay: "0.3s"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .stat-card {
          animation: float 3s ease-in-out infinite;
        }
        .stat-icon {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

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

      {/* Availability Toggle */}
      <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl border border-primary/20 overflow-hidden">
        <div className="shimmer-bg absolute inset-0 pointer-events-none" />
        <div className="card-body p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl stat-icon">
                <Power className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  Availability Status
                  {helperStore.stats?.isAvailable && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                    </span>
                  )}
                </h3>
                <p className="text-sm text-base-content/60">
                  {helperStore.stats?.isAvailable 
                    ? "You're receiving new bookings" 
                    : "You're not receiving new bookings"}
                </p>
              </div>
            </div>
            <button
              className={`btn gap-2 ${helperStore.stats?.isAvailable ? 'btn-success' : 'btn-error'} min-w-[140px] shadow-lg hover:shadow-xl transition-all duration-300`}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`card bg-gradient-to-br ${stat.gradient} border ${stat.border} shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group stat-card overflow-hidden`}
              style={{ animationDelay: stat.delay }}
              onClick={() => navigate("/helper/history")}
            >
              <div className="shimmer-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="card-body p-4 sm:p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-${stat.color}/20 rounded-xl stat-icon group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 text-${stat.color}`} />
                  </div>
                  <TrendingUp className={`w-5 h-5 text-${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-base-content/70 mb-1">
                    {stat.label}
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold text-${stat.color}`}>
                    {stat.value === null ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <span className="inline-block group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div 
          className="card bg-base-100 shadow-lg hover:shadow-xl border border-base-300 cursor-pointer group transition-all duration-300 hover:-translate-y-1"
          onClick={() => navigate("/helper/history")}
        >
          <div className="card-body p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">View All Jobs</h3>
                  <p className="text-sm text-base-content/60">See your complete job history</p>
                </div>
              </div>
              <Zap className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>

        <div 
          className="card bg-base-100 shadow-lg hover:shadow-xl border border-base-300 cursor-pointer group transition-all duration-300 hover:-translate-y-1"
          onClick={() => navigate("/helper/earnings")}
        >
          <div className="card-body p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Earnings Details</h3>
                  <p className="text-sm text-base-content/60">Track your income and payouts</p>
                </div>
              </div>
              <Zap className="w-6 h-6 text-success opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperDashboard;