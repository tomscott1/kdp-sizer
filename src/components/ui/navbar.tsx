import React from 'react';
import { Button } from './button';
import { ModeToggle } from "@/components/ui/dark-mode";
import { healthCheck } from '@/lib/utils';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-transparent h-16 flex items-center justify-between">
            <div className="ml-4">kdp-sizer</div>
            <div className="flex items-center mr-4 space-x-4">
                <Button
                    variant="outline"
                    onClick={healthCheck}
                >
                    API Health
                </Button>
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;