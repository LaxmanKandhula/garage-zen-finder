
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleParking, Menu, Search, User } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  return (
    <header className="bg-white shadow-sm py-3 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CircleParking className="text-teal-500" size={28} />
          <h1 className="text-xl font-bold text-teal-700">GarageZen</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600"
            onClick={onRefresh}
          >
            <Search size={20} />
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-600">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
