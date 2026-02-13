import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { 
  Users, 
  Mail, 
  Trash2,
  User,
  Shield,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";

const AdminUsersPage = () => {
  const { users, fetchUsers, deleteUser } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchUsers();
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "helper":
        return "badge-primary";
      case "user":
        return "badge-secondary";
      case "admin":
        return "badge-accent";
      default:
        return "badge-neutral";
    }
  };

  const filteredUsers = users
    .filter((u) => {
      if (roleFilter === "all") return true;
      return u.role === roleFilter;
    })
    .filter((u) => {
      if (!searchTerm) return true;
      return (
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const stats = {
    all: users.length,
    user: users.filter(u => u.role === "user").length,
    helper: users.filter(u => u.role === "helper").length,
    admin: users.filter(u => u.role === "admin").length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            User Management
          </h1>
          <p className="text-base-content/60 mt-1">Manage all registered users</p>
        </div>
        <div className="badge badge-lg badge-accent gap-2">
          <Sparkles className="w-4 h-4" />
          Admin Panel
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Total Users</div>
            <div className="text-2xl font-bold text-primary">{stats.all}</div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Regular Users</div>
            <div className="text-2xl font-bold text-secondary">{stats.user}</div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Helpers</div>
            <div className="text-2xl font-bold text-primary">{stats.helper}</div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="text-xs text-base-content/60">Admins</div>
            <div className="text-2xl font-bold text-accent">{stats.admin}</div>
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
                placeholder="Search by name or email..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles ({stats.all})</option>
                <option value="user">Users ({stats.user})</option>
                <option value="helper">Helpers ({stats.helper})</option>
                <option value="admin">Admins ({stats.admin})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 mt-4">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body items-center justify-center py-12">
            <Users className="w-16 h-16 text-base-content/20 mb-3" />
            <p className="text-lg font-semibold text-base-content/60">
              {searchTerm || roleFilter !== "all" ? "No users found" : "No users yet"}
            </p>
            <p className="text-sm text-base-content/40">
              {searchTerm || roleFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Users will appear here"}
            </p>
            {(searchTerm || roleFilter !== "all") && (
              <button 
                className="btn btn-primary btn-sm mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="card-body p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="avatar placeholder">
                      <div className={`rounded-full w-12 h-12 ${
                        user.role === "admin" 
                          ? "bg-accent text-accent-content" 
                          : user.role === "helper"
                          ? "bg-primary text-primary-content"
                          : "bg-secondary text-secondary-content"
                      }`}>
                        <span className="text-lg font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate">{user.name}</h3>
                        {user.role === "admin" && (
                          <Shield className="w-4 h-4 text-accent flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <span className={`badge ${getRoleBadgeColor(user.role)} badge-sm`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    className="btn btn-error btn-sm gap-2"
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id || user.role === "admin"}
                  >
                    {deletingId === user._id ? (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;