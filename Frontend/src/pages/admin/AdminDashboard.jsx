import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Wrench, 
  Briefcase, 
  DollarSign,
  TrendingUp,
  Sparkles,
  UserCheck,
  Power,
  Zap,
  ChefHat,
  Car,
  Home,
  Leaf,
  LayoutDashboard,
  IndianRupee
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const adminStore = useAdminStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          adminStore.fetchStats(),
          adminStore.fetchActiveHelpers()
        ]);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      "plumbing": Wrench,
      "electrician": Zap,
      "cooking": ChefHat,
      "car cleaning": Car,
      "house cleaning": Home,
      "gardening": Leaf
    };
    return icons[category?.toLowerCase()] || Wrench;
  };

  const stats = [
    {
      label: "Total Users",
      value: adminStore.stats?.totalUsers || 0,
      icon: Users,
      color: "primary",
      gradient: "from-primary/10 to-primary/5",
      border: "border-primary/20",
      delay: "0s"
    },
    {
      label: "Total Helpers",
      value: adminStore.stats?.totalHelpers || 0,
      icon: Wrench,
      color: "secondary",
      gradient: "from-secondary/10 to-secondary/5",
      border: "border-secondary/20",
      delay: "0.1s"
    },
    {
      label: "Total Bookings",
      value: adminStore.stats?.totalBookings || 0,
      icon: Briefcase,
      color: "info",
      gradient: "from-info/10 to-info/5",
      border: "border-info/20",
      delay: "0.2s"
    },
    {
  label: "Total Earnings",
  value: `₹${adminStore.stats?.totalEarnings || 0}`,
  icon: IndianRupee,
  color: "success",
  gradient: "from-success/10 to-success/5",
  border: "border-success/20",
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
        .helper-icon-container {
          animation: float 2.5s ease-in-out infinite;
        }
        .helper-icon-glow {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-base-content/60 mt-1">Monitor platform overview and activity</p>
        </div>
        <div className="badge badge-lg badge-accent gap-2">
          <Sparkles className="w-4 h-4" />
          Admin Panel
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
                    {isLoading ? (
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

      {/* Active Helpers Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Power className="w-5 h-5 text-success" />
          <h2 className="text-lg sm:text-xl font-semibold">Active Helpers</h2>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <div className="badge badge-success gap-1 ml-auto">
            <UserCheck className="w-3 h-3" />
            {adminStore.activeHelpers.length} Online
          </div>
        </div>

        {isLoading ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-2">Loading active helpers...</p>
            </div>
          </div>
        ) : adminStore.activeHelpers.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <UserCheck className="w-16 h-16 text-base-content/20 mb-3" />
              <p className="text-lg font-semibold text-base-content/60">No active helpers right now</p>
              <p className="text-sm text-base-content/40">Helpers will appear here when they go online</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {adminStore.activeHelpers.map((helper, index) => {
              const IconComponent = getCategoryIcon(helper.category);
              return (
                <div
                  key={helper._id}
                  className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-body p-4 sm:p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="helper-icon-container relative">
                        <div className="absolute inset-0 bg-success opacity-20 blur-xl rounded-2xl helper-icon-glow group-hover:opacity-40 transition-opacity duration-300" />
                        <div className="relative bg-success p-4 sm:p-5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.5]" />
                        </div>
                      </div>
                    </div>

                    {/* Helper Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2 truncate group-hover:text-primary transition-colors">
                        {helper.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="badge badge-outline badge-sm capitalize">
                          {helper.category}
                        </span>
                        <span className="badge badge-success badge-sm gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-content opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-content"></span>
                          </span>
                          Online
                        </span>
                      </div>
                      {helper.averageRating && (
                        <div className="flex items-center justify-center gap-1">
                          <div className="rating rating-sm">
                            <input type="radio" className="mask mask-star-2 bg-warning" disabled checked={helper.averageRating >= 1} />
                            <input type="radio" className="mask mask-star-2 bg-warning" disabled checked={helper.averageRating >= 2} />
                            <input type="radio" className="mask mask-star-2 bg-warning" disabled checked={helper.averageRating >= 3} />
                            <input type="radio" className="mask mask-star-2 bg-warning" disabled checked={helper.averageRating >= 4} />
                            <input type="radio" className="mask mask-star-2 bg-warning" disabled checked={helper.averageRating >= 5} />
                          </div>
                          <span className="text-sm font-semibold ml-1">
                            {helper.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
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

export default AdminDashboard;