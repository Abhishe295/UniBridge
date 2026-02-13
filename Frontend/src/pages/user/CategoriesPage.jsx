import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Wrench, Zap, ChefHat, Car, Home, Leaf } from "lucide-react";

const categories = [
  { name: "plumbing", icon: Wrench, description: "Fixing pipes, leaks & more" },
  { name: "electrician", icon: Zap, description: "Electrical repairs & installations" },
  { name: "cooking", icon: ChefHat, description: "Professional cooking services" },
  { name: "car cleaning", icon: Car, description: "Complete car wash & detailing" },
  { name: "house cleaning", icon: Home, description: "Deep cleaning & maintenance" },
  { name: "gardening", icon: Leaf, description: "Lawn care & landscaping" }
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .service-icon-container {
          animation: float 2.5s ease-in-out infinite;
        }
        .service-icon-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

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
        {categories.map((cat, index) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={cat.name}
              className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              onClick={() => navigate(`/user/helpers/${cat.name}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-body p-6">
                {/* Icon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="service-icon-container relative">
                    {/* Glow effect background */}
                    <div className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-2xl service-icon-glow group-hover:opacity-40 transition-opacity duration-300" />
                    
                    {/* Icon container */}
                    <div className="relative bg-primary p-4 sm:p-5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.5] relative z-10" />
                    </div>
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
          );
        })}
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