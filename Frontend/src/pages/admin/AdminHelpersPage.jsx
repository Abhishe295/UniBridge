import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { 
  Wrench, 
  Users, 
  UserCheck,
  Trash2,
  Star,
  Award,
  CheckCircle,
  Sparkles,
  Power,
  Zap,
  ChefHat,
  Car,
  Home,
  Leaf
} from "lucide-react";
import toast from "react-hot-toast";

const AdminHelpersPage = () => {
  const {
    helpers,
    activeHelpers,
    fetchHelpers,
    fetchActiveHelpers,
    deleteHelper
  } = useAdminStore();

  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchHelpers(), fetchActiveHelpers()]);
      } catch (error) {
        toast.error("Failed to load helpers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (helperId) => {
    if (!confirm("Are you sure you want to delete this helper?")) return;
    
    setDeletingId(helperId);
    try {
      await deleteHelper(helperId);
      toast.success("Helper deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete helper");
    } finally {
      setDeletingId(null);
    }
  };

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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .helper-icon-container {
          animation: float 2.5s ease-in-out infinite;
        }
        .helper-icon-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Wrench className="w-7 h-7 text-primary" />
            Helper Management
          </h1>
          <p className="text-base-content/60 mt-1">Manage and monitor all helpers on the platform</p>
        </div>
        <div className="badge badge-lg badge-accent gap-2">
          <Sparkles className="w-4 h-4" />
          Admin Panel
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-base-content/70">Total Helpers</div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    helpers.length
                  )}
                </div>
              </div>
              <div className="p-3 bg-primary/20 rounded-full">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-base-content/70">Active Now</div>
                <div className="text-2xl sm:text-3xl font-bold text-success mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    activeHelpers.length
                  )}
                </div>
              </div>
              <div className="p-3 bg-success/20 rounded-full">
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Helpers Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Power className="w-5 h-5 text-success" />
          <h2 className="text-lg sm:text-xl font-semibold">Active Helpers</h2>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
        </div>

        {isLoading ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-2">Loading active helpers...</p>
            </div>
          </div>
        ) : activeHelpers.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <UserCheck className="w-16 h-16 text-base-content/20 mb-3" />
              <p className="text-base-content/60">No active helpers right now</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeHelpers.map((helper) => {
              const IconComponent = getCategoryIcon(helper.category);
              return (
                <div
                  key={helper._id}
                  className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <div className="helper-icon-container relative">
                        <div className="absolute inset-0 bg-success opacity-20 blur-lg rounded-xl helper-icon-glow" />
                        <div className="relative bg-success p-3 rounded-xl shadow-md">
                          <IconComponent className="w-6 h-6 text-white stroke-[2.5]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate">{helper.name}</h3>
                        <p className="text-sm text-base-content/60 capitalize">{helper.category}</p>
                      </div>
                      <div className="badge badge-success badge-sm">Online</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Helpers Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">All Helpers</h2>
        </div>

        {isLoading ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-2">Loading helpers...</p>
            </div>
          </div>
        ) : helpers.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body items-center justify-center py-12">
              <Users className="w-16 h-16 text-base-content/20 mb-3" />
              <p className="text-base-content/60">No helpers registered</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {helpers.map((helper) => {
              const IconComponent = getCategoryIcon(helper.category);
              return (
                <div
                  key={helper._id}
                  className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="helper-icon-container relative">
                          <div className="absolute inset-0 bg-primary opacity-20 blur-lg rounded-xl helper-icon-glow" />
                          <div className="relative bg-primary p-3 rounded-xl shadow-md">
                            <IconComponent className="w-6 h-6 text-white stroke-[2.5]" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{helper.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-outline badge-sm capitalize">{helper.category}</span>
                            {helper.averageRating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-warning text-warning" />
                                <span className="text-sm font-semibold">{helper.averageRating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-error btn-sm gap-2"
                        onClick={() => handleDelete(helper._id)}
                        disabled={deletingId === helper._id}
                      >
                        {deletingId === helper._id ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>
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

export default AdminHelpersPage;