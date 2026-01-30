
import React, { useState, useEffect, useMemo } from 'react';
import { View, Product, DesignData, OrderItem, WorkflowStage, ProductionOrder } from './types';
import HomeView from './components/HomeView';
import DesignEditorView from './components/DesignEditorView';
import SummaryView from './components/SummaryView';
import AdminView from './components/AdminView';
import { PRODUCTS as INITIAL_PRODUCTS, INITIAL_WORKFLOW_STAGES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    return (localStorage.getItem('bradwear_view') as View) || View.HOME;
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bradwear_theme') as 'light' | 'dark') || 'dark';
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bradwear_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

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
    return saved ? JSON.parse(saved) : {
      productId: '',
      color: '#1A1A1A',
      material: 'Katun Drill',
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
    localStorage.setItem('bradwear_view', currentView);
    localStorage.setItem('bradwear_theme', theme);
    localStorage.setItem('bradwear_order_code', orderCode);
    localStorage.setItem('bradwear_design_data', JSON.stringify(designData));
    localStorage.setItem('bradwear_order_items', JSON.stringify(orderItems));
    if (selectedProduct) {
      localStorage.setItem('bradwear_selected_product', JSON.stringify(selectedProduct));
    } else {
      localStorage.removeItem('bradwear_selected_product');
    }
  }, [products, productionOrders, currentView, theme, designData, orderItems, selectedProduct, orderCode]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDesignData(prev => ({ ...prev, productId: product.id }));
    setCurrentView(View.EDITOR);
  };

  const handleUpdateDesign = (data: Partial<DesignData>) => {
    setDesignData(prev => ({ ...prev, ...data }));
  };

  const handleGoBack = () => {
    setCurrentView(View.HOME);
    setSelectedProduct(null);
  };

  return (
    <div className={`h-screen w-screen overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-200'} flex justify-center items-center`}>
      <div className={`h-full w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-[1200px] shadow-premium relative overflow-hidden flex flex-col border-x ${theme === 'dark' ? 'bg-black text-white border-white/5' : 'bg-white text-zinc-900 border-zinc-200'}`}>
        
        <header className={`px-6 py-6 flex items-center justify-between border-b shrink-0 z-50 ${theme === 'dark' ? 'bg-black/80 border-white/5 backdrop-blur-xl' : 'bg-white/90 border-zinc-100 backdrop-blur-xl'}`}>
          <div className="flex flex-col cursor-pointer" onClick={() => setCurrentView(View.HOME)}>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black tracking-tighter italic neon-text`}>BRADWEAR</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500`}>INDONESIA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className={`p-3 rounded-2xl transition-all active:scale-90 ${theme === 'dark' ? 'bg-zinc-900 neon-text border border-white/5' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
              {theme === 'dark' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>
            <button onClick={() => setCurrentView(View.ADMIN)} className={`p-3 rounded-2xl transition-all active:scale-90 ${theme === 'dark' ? 'bg-zinc-900 text-white border border-white/5' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        </header>

        <div className="flex-1 h-full overflow-hidden flex flex-col relative no-scrollbar">
          {currentView === View.HOME && (
            <div className="h-full overflow-y-auto no-scrollbar scroll-smooth view-transition">
              <HomeView 
                products={products}
                workflowStages={userWorkflowStages}
                orderCode={orderCode}
                branding={{ title: "Bradwear Manufacture", subtitle: "Industrial Quality Uniform & Shirt" }}
                onSelectProduct={handleSelectProduct} 
                theme={theme} 
              />
            </div>
          )}

          {currentView === View.EDITOR && selectedProduct && (
            <div className="h-full overflow-hidden view-transition">
              <DesignEditorView 
                product={selectedProduct} 
                designData={designData}
                onUpdate={handleUpdateDesign}
                onBack={handleGoBack}
                onNext={() => setCurrentView(View.SUMMARY)}
                theme={theme}
              />
            </div>
          )}

          {currentView === View.SUMMARY && selectedProduct && (
            <div className="h-full overflow-hidden view-transition">
              <SummaryView 
                product={selectedProduct}
                designData={designData}
                orderItems={orderItems}
                setOrderItems={setOrderItems}
                onBack={() => setCurrentView(View.EDITOR)}
                theme={theme}
              />
            </div>
          )}

          {currentView === View.ADMIN && (
            <div className="h-full overflow-hidden view-transition">
              <AdminView 
                products={products}
                setProducts={setProducts}
                productionOrders={productionOrders}
                setProductionOrders={setProductionOrders}
                orderCode={orderCode}
                setOrderCode={setOrderCode}
                branding={{ title: "Admin Panel", subtitle: "Real-time Production Control" }}
                setBranding={() => {}}
                onBack={handleGoBack}
                theme={theme}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
