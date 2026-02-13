import SupportChat from "../../components/SupportChat";

const AdminSupport = () => {
  // For demo — manually join a test room
  const testRoom = "support-user-TEST_USER_ID";

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Admin Support</h1>

      <SupportChat room={testRoom} />
    </div>
  );
};

export default AdminSupport;
