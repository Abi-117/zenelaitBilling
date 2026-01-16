import { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Software License', stock: 20, cost: 3000 },
    { id: 2, name: 'Printer Paper Box', stock: 50, cost: 200 },
  ]);

  // 🔥 STOCK IN (GRN)
  const stockIn = (itemId, qty) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, stock: item.stock + qty }
          : item
      )
    );
  };

  return (
    <InventoryContext.Provider value={{ items, stockIn }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
