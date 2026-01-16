const styles = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700'
};

const Badge = ({ status }) => (
  <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
    {status}
  </span>
);

export default Badge;
