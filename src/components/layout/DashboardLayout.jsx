const DashboardLayout = ({ sidebar, children }) => (
  <div className="flex h-screen">
    {sidebar}
    <main className="flex-1 overflow-y-auto p-6">{children}</main>
  </div>
);

export default DashboardLayout;
