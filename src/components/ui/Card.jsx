const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border p-4 ${className}`}>
    {children}
  </div>
);

export default Card;
