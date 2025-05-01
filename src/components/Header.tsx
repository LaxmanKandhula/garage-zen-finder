
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleParking, Menu, Search, User, UserRound, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };

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
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full p-0 h-9 w-9">
                  <Avatar className="h-9 w-9">
                    {user?.photoUrl ? (
                      <AvatarImage src={user.photoUrl} alt={user?.name || 'User'} />
                    ) : null}
                    <AvatarFallback className="bg-teal-100 text-teal-700">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start p-2">
                  <div className="ml-2 text-sm font-medium">
                    {user?.name || 'User'}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <UserRound size={20} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
