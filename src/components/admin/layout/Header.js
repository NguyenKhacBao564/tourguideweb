import React from 'react';
import { UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <div className="admin-header">
      <h1 className="admin-title">Admin</h1>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img 
            src="/lovable-uploads/c2522488-c5ce-423a-bd92-aaf3c59b1702.png" 
            alt="Admin Avatar" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Header; 