import { useAuthStore } from "../../store/authStores";
import SupportChat from "../../components/SupportChat";

const UserSupport = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Support</h1>
      <div>
        Please open a booking to chat with your helper.
      </div>
    </div>
  );
};

export default UserSupport;


