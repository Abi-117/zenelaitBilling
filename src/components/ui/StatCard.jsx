const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded-xl p-4">
    <p className="text-sm text-slate-500">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default StatCard;
