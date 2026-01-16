const BillableHoursView = ({ timesheets }) => {
  const totalHours = timesheets.reduce((a, b) => a + b.hours, 0);
  const totalAmount = timesheets.reduce(
    (a, b) => a + b.hours * b.rate,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Stat label="Total Billable Hours" value={`${totalHours} hrs`} />
      <Stat label="Entries" value={timesheets.length} />
      <Stat label="Billable Amount" value={`₹${totalAmount}`} />
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default BillableHoursView;
