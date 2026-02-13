import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const categories = [
  { name: "plumbing", icon: "🔧", color: "from-blue-500 to-blue-600", description: "Fixing pipes, leaks & more" },
  { name: "electrician", icon: "⚡", color: "from-yellow-500 to-yellow-600", description: "Electrical repairs & installations" },
  { name: "cooking", icon: "👨‍🍳", color: "from-orange-500 to-orange-600", description: "Professional cooking services" },
  { name: "car cleaning", icon: "🚗", color: "from-purple-500 to-purple-600", description: "Complete car wash & detailing" },
  { name: "house cleaning", icon: "🏠", color: "from-green-500 to-green-600", description: "Deep cleaning & maintenance" },
  { name: "gardening", icon: "🌱", color: "from-emerald-500 to-emerald-600", description: "Lawn care & landscaping" }
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            Service Categories
          </h1>
          <p className="text-base-content/60 mt-1">Choose a service to book a helper</p>
        </div>
        <div className="badge badge-lg badge-primary gap-2">
          {categories.length} Categories
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-2"
            onClick={() => navigate(`/user/helpers/${cat.name}`)}
          >
            <div className="card-body p-6">
              {/* Icon Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`text-4xl sm:text-5xl p-4 rounded-2xl bg-gradient-to-br ${cat.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <ArrowRight className="w-6 h-6 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold capitalize group-hover:text-primary transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-base-content/60">
                  {cat.description}
                </p>
              </div>

              {/* Footer Badge */}
              <div className="mt-4 pt-4 border-t border-base-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-base-content/60">
                    Available helpers
                  </span>
                  <div className="badge badge-primary badge-sm">Book Now</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="card-body p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Need help choosing?</h3>
              <p className="text-sm text-base-content/70">
                Each category has verified helpers ready to assist you. Click on any service to view available helpers and book instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;