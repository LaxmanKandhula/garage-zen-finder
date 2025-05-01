
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Shield } from 'lucide-react';

interface EmergencyModeToggleProps {
  isEmergencyMode: boolean;
  onToggle: () => void;
}

const EmergencyModeToggle: React.FC<EmergencyModeToggleProps> = ({ 
  isEmergencyMode, 
  onToggle 
}) => {
  return (
    <Button 
      variant={isEmergencyMode ? "destructive" : "outline"} 
      size="sm"
      className={`flex items-center gap-1 ${isEmergencyMode ? '' : 'border-red-200 text-red-700 hover:bg-red-50'}`}
      onClick={onToggle}
    >
      {isEmergencyMode ? (
        <>
          <Car size={16} />
          <span>Exit Emergency</span>
        </>
      ) : (
        <>
          <Shield size={16} />
          <span>Emergency</span>
        </>
      )}
    </Button>
  );
};

export default EmergencyModeToggle;
