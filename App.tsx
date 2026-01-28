
import React, { useState } from 'react';
import { View, Product, DesignData, OrderItem } from './types';
import HomeView from './components/HomeView';
import DesignEditorView from './components/DesignEditorView';
import SummaryView from './components/SummaryView';
import AdminView from './components/AdminView';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [appBranding, setAppBranding] = useState({
    title: "Bradermock",
    subtitle: "Mulai kustomisasi seragam impian Anda"
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [designData, setDesignData] = useState<DesignData>({
    productId: '',
    color: '#FFFFFF',
    material: 'Drill',
    view: 'Depan'
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { size: 'S', quantity: 0 },
    { size: 'M', quantity: 0 },
    { size: 'L', quantity: 0 },
    { size: 'XL', quantity: 0 },
    { size: 'XXL', quantity: 0 },
  ]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDesignData(prev => ({ ...prev, productId: product.id }));
    setCurrentView(View.EDITOR);
  };

  const handleUpdateDesign = (data: Partial<DesignData>) => {
    setDesignData(prev => ({ ...prev, ...data }));
  };

  const handleGoBack = () => {
    if (currentView === View.EDITOR) setCurrentView(View.HOME);
    if (currentView === View.SUMMARY) setCurrentView(View.EDITOR);
    if (currentView === View.ADMIN) setCurrentView(View.HOME);
  };

  const handleNext = () => {
    if (currentView === View.EDITOR) setCurrentView(View.SUMMARY);
  };

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'} flex justify-center`}>
      <div className={`w-full max-w-[430px] shadow-2xl relative overflow-hidden flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'}`}>
        {currentView === View.HOME && (
          <HomeView 
            products={products}
            branding={appBranding}
            onSelectProduct={handleSelectProduct} 
            theme={theme} 
            toggleTheme={toggleTheme}
            onOpenAdmin={() => setCurrentView(View.ADMIN)}
          />
        )}
        
        {currentView === View.EDITOR && selectedProduct && (
          <DesignEditorView 
            product={selectedProduct} 
            designData={designData}
            onUpdate={handleUpdateDesign}
            onBack={handleGoBack}
            onNext={handleNext}
            theme={theme}
          />
        )}

        {currentView === View.SUMMARY && selectedProduct && (
          <SummaryView 
            product={selectedProduct}
            designData={designData}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            onBack={handleGoBack}
            theme={theme}
          />
        )}

        {currentView === View.ADMIN && (
          <AdminView 
            products={products}
            setProducts={handleUpdateProducts}
            branding={appBranding}
            setBranding={setAppBranding}
            onBack={handleGoBack}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};

export default App;
