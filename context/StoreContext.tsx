import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { View, Product, DesignData, OrderItem, ProductionOrder, WorkflowStage } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, INITIAL_WORKFLOW_STAGES } from '../constants';
import { COLORS } from '../constants'; // Sometimes needed for designData defaults

interface StoreState {
  currentView: View;
  setCurrentView: (view: View) => void;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orderCode: string;
  setOrderCode: (code: string) => void;
  productionOrders: ProductionOrder[];
  setProductionOrders: (orders: ProductionOrder[]) => void;
  userWorkflowStages: WorkflowStage[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  designData: DesignData;
  setDesignData: React.Dispatch<React.SetStateAction<DesignData>>;
  updateDesignData: (data: Partial<DesignData>) => void;
  orderItems: OrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  
  // Actions
  handleSelectProduct: (product: Product) => void;
  handleGoBack: () => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE DEFINITIONS ---

  const [currentView, setCurrentView] = useState<View>(() => {
    return (localStorage.getItem('bradwear_current_view') as View) || View.HOME;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bradwear_theme') as 'light' | 'dark') || 'light';
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const [orderCode, setOrderCode] = useState(() => {
    return localStorage.getItem('bradwear_order_code') || Math.floor(Math.random() * 9000 + 1000).toString();
  });

  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => {
    const saved = localStorage.getItem('bradwear_production_orders');
    if (saved) return JSON.parse(saved);
    return [{
      orderCode: localStorage.getItem('bradwear_order_code') || '1234',
      productCode: 'BRD-MOCK-01',
      customerName: 'Customer Baru',
      productName: INITIAL_PRODUCTS[0].name,
      category: INITIAL_PRODUCTS[0].category,
      totalQty: 12,
      orderItems: [{ size: 'M', quantity: 12, gender: 'L' }],
      stages: INITIAL_WORKFLOW_STAGES,
      createdAt: new Date().toISOString()
    }];
  });

  const userWorkflowStages = useMemo(() => {
    const order = productionOrders.find(o => o.orderCode === orderCode);
    return order ? order.stages : INITIAL_WORKFLOW_STAGES;
  }, [productionOrders, orderCode]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const saved = localStorage.getItem('bradwear_selected_product');
    return saved ? JSON.parse(saved) : null;
  });

  const [designData, setDesignData] = useState<DesignData>(() => {
    const saved = localStorage.getItem('bradwear_design_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, elements: [] }; // Reset elements on refresh/start
    }
    return {
      productId: '',
      color: '#212121',
      material: 'TROPICAL',
      view: 'Depan',
      elements: [],
      namePos: { x: 50, y: 35 },
      logoPos: { x: 50, y: 45 }
    };
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('bradwear_order_items');
    return saved ? JSON.parse(saved) : [];
  });

  // --- EFFECTS ---

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bradwear_products', JSON.stringify(products));
    localStorage.setItem('bradwear_production_orders', JSON.stringify(productionOrders));

    localStorage.setItem('bradwear_theme', theme);
    localStorage.setItem('bradwear_current_view', currentView);
    localStorage.setItem('bradwear_order_code', orderCode);
    localStorage.setItem('bradwear_design_data', JSON.stringify(designData));
    localStorage.setItem('bradwear_order_items', JSON.stringify(orderItems));
    if (selectedProduct) {
      localStorage.setItem('bradwear_selected_product', JSON.stringify(selectedProduct));
    } else {
      localStorage.removeItem('bradwear_selected_product');
    }
  }, [products, productionOrders, currentView, theme, designData, orderItems, selectedProduct, orderCode]);

  // --- ACTIONS ---

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDesignData(prev => ({ ...prev, productId: product.id }));
    setCurrentView(View.EDITOR);
  };

  const updateDesignData = (data: Partial<DesignData>) => {
    setDesignData(prev => ({ ...prev, ...data }));
  };

  const handleGoBack = () => {
    setCurrentView(View.HOME);
    setSelectedProduct(null);
  };

  return (
    <StoreContext.Provider value={{
      currentView, setCurrentView,
      theme, setTheme,
      products, setProducts,
      orderCode, setOrderCode,
      productionOrders, setProductionOrders,
      userWorkflowStages,
      selectedProduct, setSelectedProduct,
      designData, setDesignData, updateDesignData,
      orderItems, setOrderItems,
      handleSelectProduct,
      handleGoBack
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
