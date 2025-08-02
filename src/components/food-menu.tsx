"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Save, 
  X,
  UtensilsCrossed,
  DollarSign,
  Tag,
  Camera,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDocumentData } from "@/lib/document-data-store";
import SuccessToast from "./success-toast";
import DataReviewModal from "./data-review-modal";


interface AddOn {
  name: string;
  price: number;
}

interface MenuItem {
  name: string;
  picture: string;
  price: number;
  description: string;
  Category: string;
  addOns: AddOn[];
  disabled?: boolean;
}

interface FoodMenuProps {
  onBack: () => void;
}

export default function FoodMenu({ onBack }: FoodMenuProps) {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // AI smart navigation & staged data integration
  const { stagedData, clearStagedData } = useDocumentData();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Menu data from the provided JSON
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      name: "Nasi Lemak Ayam Goreng Berempah",
      picture: "https://mnxcvpzefuwuccprqnxl.supabase.co/storage/v1/object/public/pdfs/ad4964f4-4caa-41bd-ae8e-6e8a6c629c0e_menu_1.jpeg",
      price: 9.5,
      description: "Fragrant coconut rice served with crispy spiced fried chicken, sambal, fried anchovies, peanuts, boiled egg, and cucumber slices.",
      Category: "Main Course",
      addOns: [
        { name: "Extra Ayam Goreng", price: 5 },
        { name: "Tambah Sambal (Extra Spicy)", price: 1 },
        { name: "Replace rice with brown rice", price: 1.5 }
      ]
    },
    {
      name: "Nasi Lemak Sotong Sambal",
      picture: "https://mnxcvpzefuwuccprqnxl.supabase.co/storage/v1/object/public/pdfs/ad4964f4-4caa-41bd-ae8e-6e8a6c629c0e_menu_2.jpeg",
      price: 11,
      description: "Tender squid cooked in spicy sambal, served with coconut rice, anchovies, peanuts, cucumber, and boiled egg.",
      Category: "Main Course",
      addOns: [
        { name: "Extra Sotong", price: 6 },
        { name: "Less spicy sambal", price: 0 },
        { name: "Add fried egg", price: 2 }
      ]
    },
    {
      name: "Nasi Lemak Rendang Daging",
      picture: "https://mnxcvpzefuwuccprqnxl.supabase.co/storage/v1/object/public/pdfs/ad4964f4-4caa-41bd-ae8e-6e8a6c629c0e_menu_3.jpeg",
      price: 12,
      description: "Creamy, slow-cooked beef rendang served with rich coconut rice, sambal, crunchy peanuts, fried anchovies, and cucumber.",
      Category: "Main Course",
      addOns: [
        { name: "Extra Daging Rendang", price: 7 },
        { name: "Replace rice with cauliflower rice (low carb)", price: 2 }
      ]
    },
    {
      name: "Teh Ais Kaw",
      picture: "https://mnxcvpzefuwuccprqnxl.supabase.co/storage/v1/object/public/pdfs/ad4964f4-4caa-41bd-ae8e-6e8a6c629c0e_menu_4.jpeg",
      price: 2.5,
      description: "Strong and creamy iced milk tea, Malaysian-style.",
      Category: "Drinks",
      addOns: [
        { name: "Kurang Manis (less sugar)", price: 0 },
        { name: "Ganti susu oat (oat milk)", price: 1 },
        { name: "Add grass jelly", price: 1 }
      ]
    },
    {
      name: "Kuih-Muih Trio Platter",
      picture: "https://mnxcvpzefuwuccprqnxl.supabase.co/storage/v1/object/public/pdfs/ad4964f4-4caa-41bd-ae8e-6e8a6c629c0e_menu_5.jpeg",
      price: 4.5,
      description: "A selection of 3 assorted traditional kuih – kuih lapis, onde-onde, and seri muka – for a sweet finish.",
      Category: "Sides & Dessert",
      addOns: [
        { name: "Swap one kuih (choose from menu)", price: 0 },
        { name: "Add extra piece", price: 1.5 }
      ]
    }
  ]);

  // Apply staged AI changes when available
  useEffect(() => {
    if (stagedData && stagedData.dataType === "Food Menu") {
      // Generate changes object for the modal
      const changes: Record<string, any> = {};
      Object.entries(stagedData.extractedData).forEach(([key, newValue]) => {
        // Handle bulk operations
        if (key.startsWith('BULK_')) {
          const parts = key.split('_');
          const operation = parts[1];
          const criteriaRaw = parts.slice(2).join('_');
          const targetValue = operation === 'enable' ? false : true;

          menuItems.forEach((item, index) => {
            let shouldApply = false;

            if (criteriaRaw === 'all') {
              shouldApply = true;
            } else {
              const searchText = `${item.name} ${item.description}`.toLowerCase();
              const criteriaNormalized = criteriaRaw.replace(/_/g, ' ').toLowerCase();

              // Match if either full phrase matches or ALL words are present
              if (searchText.includes(criteriaNormalized)) {
                shouldApply = true;
              } else {
                const words = criteriaNormalized.split(' ').filter(Boolean);
                shouldApply = words.every(word => searchText.includes(word));
              }
            }

            if (shouldApply && item.disabled !== targetValue) {
              changes[`${index}_disabled`] = {
                field: `${item.name} - Status`,
                old: item.disabled ? 'Disabled' : 'Enabled',
                new: targetValue ? 'Disabled' : 'Enabled'
              };
            }
          });
        } else {
          // Handle individual item changes
          const match = key.match(/^(\d+)_(.+)$/);
          if (!match) return;
          const index = parseInt(match[1], 10);
          const field = match[2];
          if (menuItems[index] && field in menuItems[index]) {
            const oldValue = (menuItems[index] as any)[field];
            let displayValue = oldValue;
            let newDisplayValue = newValue;
            
            // Special handling for disabled field
            if (field === 'disabled') {
              displayValue = oldValue ? 'Disabled' : 'Enabled';
              newDisplayValue = newValue ? 'Disabled' : 'Enabled';
            }
            
            changes[key] = {
              field: `${menuItems[index].name} - ${field.charAt(0).toUpperCase() + field.slice(1)}`,
              old: displayValue,
              new: newDisplayValue
            };
          }
        }
      });
      
     // Update staged data with changes
     if (Object.keys(changes).length > 0) {
       stagedData.changes = changes;
     }
     
     setShowReviewModal(true);
   }
 }, [stagedData]);

  // Store menu data globally for AI access
  useEffect(() => {
    // Store current menu items in localStorage for AI to reference
    localStorage.setItem('currentMenuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  // Handle review modal confirmation
  const handleReviewModalProceed = (selectedChanges: Record<string, any>) => {
    if (!stagedData) return;

    const updatedItems = [...menuItems];
    let applied = 0;

    Object.entries(selectedChanges).forEach(([key, change]) => {
      const match = key.match(/^(\d+)_(.+)$/);
      if (!match) return;
      const index = parseInt(match[1], 10);
      const field = match[2];
      if (updatedItems[index]) {
        let valueToApply = change.new;
        
        // Special handling for disabled field - convert display text back to boolean
        if (field === 'disabled') {
          valueToApply = change.new === 'Disabled' ? true : false;
        }
        
        // @ts-ignore – dynamic field assignment (allows adding new field)
        (updatedItems[index] as any)[field] = valueToApply;
        applied += 1;
      }
    });

    if (applied > 0) {
      setMenuItems(updatedItems);
      setSuccessMessage(`Applied ${applied} change${applied !== 1 ? "s" : ""} from AI assistant.`);
      setShowSuccessToast(true);
    }

    clearStagedData();
    setShowReviewModal(false);
  };

  const handleReviewModalCancel = () => {
    clearStagedData();
    setShowReviewModal(false);
  };

  const [newItem, setNewItem] = useState<MenuItem>({
    name: "",
    picture: "",
    price: 0,
    description: "",
    Category: "Main Course",
    addOns: [],
    disabled: false
  });

  // Group items by category
  const categorizedItems = menuItems.reduce((acc, item, index) => {
    if (!acc[item.Category]) {
      acc[item.Category] = [];
    }
    acc[item.Category].push({ ...item, originalIndex: index });
    return acc;
  }, {} as Record<string, (MenuItem & { originalIndex: number })[]>);

  const categories = Object.keys(categorizedItems);

  const handleEditItem = (index: number) => {
    setEditingItem(index);
    setIsAddingNew(false);
  };

  const handleSaveItem = (index: number, updatedItem: MenuItem) => {
    const updatedItems = [...menuItems];
    updatedItems[index] = updatedItem;
    setMenuItems(updatedItems);
    setEditingItem(null);
  };

  const handleAddNewItem = () => {
    setMenuItems([...menuItems, newItem]);
    setNewItem({
      name: "",
      picture: "",
      price: 0,
      description: "",
      Category: "Main Course",
      addOns: [],
      disabled: false
    });
    setIsAddingNew(false);
  };

  const handleDeleteItem = (index: number) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      const updatedItems = menuItems.filter((_, i) => i !== index);
      setMenuItems(updatedItems);
    }
  };

  const formatPrice = (price: number) => {
    return `RM ${price.toFixed(2)}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Main Course': return '🍽️';
      case 'Drinks': return '🥤';
      case 'Sides & Dessert': return '🧁';
      default: return '🍴';
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Food Menu</h1>
                  <p className="text-sm text-gray-600">Manage your restaurant menu</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Nasi Lemak Bangsar Menu</h2>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">{menuItems.length} total items</span>
              <span className="text-green-600">{menuItems.filter(item => !item.disabled).length} enabled</span>
              <span className="text-red-600">{menuItems.filter(item => item.disabled).length} disabled</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <h3 className="font-medium text-gray-900">{category}</h3>
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">
                    {categorizedItems[category].length} item{categorizedItems[category].length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex space-x-2">
                    <span className="text-green-600">
                      {categorizedItems[category].filter(item => !item.disabled).length} enabled
                    </span>
                    <span className="text-red-600">
                      {categorizedItems[category].filter(item => item.disabled).length} disabled
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items by Category */}
        {categories.map(category => (
          <div key={category} className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">{getCategoryIcon(category)}</span>
              <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {categorizedItems[category].map((item) => (
                <MenuItemCard
                  key={item.originalIndex}
                  item={item}
                  index={item.originalIndex}
                  isEditing={editingItem === item.originalIndex}
                  onEdit={() => handleEditItem(item.originalIndex)}
                  onSave={(updatedItem) => handleSaveItem(item.originalIndex, updatedItem)}
                  onCancel={() => setEditingItem(null)}
                  onDelete={() => handleDeleteItem(item.originalIndex)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Add New Item Modal */}
        {isAddingNew && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Menu Item</h3>
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <MenuItemEditor
                  item={newItem}
                  onChange={setNewItem}
                  onSave={handleAddNewItem}
                  onCancel={() => setIsAddingNew(false)}
                  isNew={true}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Success Toast for AI-applied changes */}
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Data Review Modal */}
      {showReviewModal && stagedData && (
        <DataReviewModal
          isOpen={showReviewModal}
          onClose={handleReviewModalCancel}
          onProceed={handleReviewModalProceed}
          documentData={stagedData}
          pageTitle="Food Menu"
          currentData={{}}
        />
      )}

    </div>
    </>
  );
}

// Menu Item Card Component
interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
  onDelete: () => void;
  formatPrice: (price: number) => string;
}

function MenuItemCard({ item, index, isEditing, onEdit, onSave, onCancel, onDelete, formatPrice }: MenuItemCardProps) {
  const [editedItem, setEditedItem] = useState<MenuItem>(item);

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <MenuItemEditor
          item={editedItem}
          onChange={setEditedItem}
          onSave={() => onSave(editedItem)}
          onCancel={onCancel}
          isNew={false}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${
      item.disabled ? 'opacity-50 grayscale bg-gray-100' : ''
    }`}>
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {item.disabled && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-10">
            <div className="text-center">
              <span className="text-white font-bold text-xl">UNAVAILABLE</span>
              <p className="text-gray-300 text-sm mt-1">Item is disabled</p>
            </div>
          </div>
        )}
        <img
          src={item.picture}
          alt={item.name}
          className={`w-full h-full object-cover ${item.disabled ? 'filter grayscale' : ''}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/400/200';
          }}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            item.disabled ? 'bg-gray-600 text-gray-300 line-through' : 'bg-pink-500 text-white'
          }`}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className={`text-xl font-bold mb-2 ${
            item.disabled ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {item.name}
            {item.disabled && <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-1 rounded">DISABLED</span>}
          </h3>
          <p className={`text-sm leading-relaxed ${
            item.disabled ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {item.description}
          </p>
        </div>

        {/* Add-ons */}
        {item.addOns && item.addOns.length > 0 && (
          <div>
            <h4 className={`text-sm font-semibold mb-2 ${
              item.disabled ? 'text-gray-500' : 'text-gray-700'
            }`}>
              Available Add-ons:
            </h4>
            <div className="space-y-1">
              {item.addOns.map((addon, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={`text-xs ${
                    item.disabled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {addon.name}
                  </span>
                  <span className={`text-xs font-medium ${
                    item.disabled ? 'text-gray-400 line-through' : 'text-pink-600'
                  }`}>
                    {formatPrice(addon.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="text-pink-600 border-pink-200 hover:bg-pink-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={() => {
                const updatedItem = { ...item, disabled: !item.disabled };
                onSave(updatedItem);
              }}
              variant="outline"
              size="sm"
              className={item.disabled 
                ? "text-green-600 border-green-200 hover:bg-green-50" 
                : "text-orange-600 border-orange-200 hover:bg-orange-50"
              }
            >
              {item.disabled ? 'Enable' : 'Disable'}
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Menu Item Editor Component
interface MenuItemEditorProps {
  item: MenuItem;
  onChange: (item: MenuItem) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}

function MenuItemEditor({ item, onChange, onSave, onCancel, isNew }: MenuItemEditorProps) {
  const addNewAddon = () => {
    onChange({
      ...item,
      addOns: [...item.addOns, { name: "", price: 0 }]
    });
  };

  const updateAddon = (index: number, field: keyof AddOn, value: string | number) => {
    const updatedAddOns = [...item.addOns];
    updatedAddOns[index] = { ...updatedAddOns[index], [field]: value };
    onChange({ ...item, addOns: updatedAddOns });
  };

  const removeAddon = (index: number) => {
    onChange({
      ...item,
      addOns: item.addOns.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
          <Input
            value={item.name}
            onChange={(e) => onChange({ ...item, name: e.target.value })}
            placeholder="Enter item name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (RM)</label>
          <Input
            type="number"
            step="0.10"
            value={item.price}
            onChange={(e) => onChange({ ...item, price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={item.Category}
            onChange={(e) => onChange({ ...item, Category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="Main Course">Main Course</option>
            <option value="Drinks">Drinks</option>
            <option value="Sides & Dessert">Sides & Dessert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <Input
            value={item.picture}
            onChange={(e) => onChange({ ...item, picture: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={item.disabled ? 'disabled' : 'enabled'}
            onChange={(e) => onChange({ ...item, disabled: e.target.value === 'disabled' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <Textarea
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          rows={3}
          placeholder="Describe your dish..."
        />
      </div>

      {/* Add-ons Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Add-ons</label>
          <Button
            onClick={addNewAddon}
            variant="outline"
            size="sm"
            className="text-pink-600 border-pink-200 hover:bg-pink-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Option
          </Button>
        </div>

        <div className="space-y-2">
          {item.addOns.map((addon, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Add-on name"
                value={addon.name}
                onChange={(e) => updateAddon(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                step="0.10"
                placeholder="Price"
                value={addon.price}
                onChange={(e) => updateAddon(index, 'price', parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <Button
                onClick={() => removeAddon(index)}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button onClick={onSave} className="bg-pink-500 hover:bg-pink-600">
          <Save className="w-4 h-4 mr-2" />
          {isNew ? 'Add Item' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
} 