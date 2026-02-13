import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Calendar,
  ArrowRight,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { useBookingStore } from "../../store/bookingStore";
import { useAuthStore } from "../../store/authStores";
import toast from "react-hot-toast";

const categories = [
  { name: "plumbing", icon: "🔧", color: "from-blue-500 to-blue-600" },
  { name: "electrician", icon: "⚡", color: "from-yellow-500 to-yellow-600" },
  { name: "cooking", icon: "👨‍🍳", color: "from-orange-500 to-orange-600" },
  { name: "car cleaning", icon: "🚗", color: "from-purple-500 to-purple-600" },
  { name: "house cleaning", icon: "🏠", color: "from-green-500 to-green-600" },
  { name: "gardening", icon: "🌱", color: "from-emerald-500 to-emerald-600" }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const bookingStore = useBookingStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await bookingStore.fetchUserBookings();
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBookings = bookingStore.bookings.length;
  const activeBookings = bookingStore.bookings.filter(b => b.status !== "completed").length;
  const completedBookings = bookingStore.bookings.filter(b => b.status === "completed").length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-base-content/60 mt-1">Manage your bookings and services</p>
        </div>
        <div className="badge badge-lg badge-primary gap-2">
          <Sparkles className="w-4 h-4" />
          User Dashboard
        </div>
      </div>

      {/* ===== QUICK STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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

        <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-base-content/70">Completed</div>
                <div className="text-2xl sm:text-3xl font-bold text-success mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    completedBookings
                  )}
                </div>
              </div>
              <div className="p-3 bg-success/20 rounded-full">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CATEGORY CARDS ===== */}
      <div>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">Book a Service</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate(`/user/helpers/${cat.name}`)}
            >
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl sm:text-4xl p-3 rounded-xl bg-gradient-to-br ${cat.color} bg-opacity-10`}>
                      {cat.icon}
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-bold capitalize group-hover:text-primary transition-colors">
                        {cat.name}
                      </div>
                      <div className="text-xs text-base-content/60">Click to book</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BOOKING HISTORY ===== */}
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
              <p className="text-sm text-base-content/40">Start by booking a service above</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingStore.bookings.slice(0, 5).map((b) => (
              <div
                key={b._id}
                className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl cursor-pointer group transition-all duration-300 hover:border-primary/50"
                onClick={() => navigate(`/user/booking/${b._id}`)}
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
                          <span className={`badge badge-sm ${
                            b.status === "completed" ? "badge-success" :
                            b.status === "accepted" ? "badge-info" :
                            "badge-warning"
                          }`}>
                            {b.status}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;