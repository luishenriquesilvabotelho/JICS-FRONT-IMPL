'use client';

import { MainNav } from '@/components/main-nav';
import React, { useState, useEffect } from 'react';


const AbaUser: React.FC = () => {


    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="fixed top-0 left-0 right-0 z-50 w-ful">
                <MainNav />
            </div>
            
        </main>
    );
};

export default AbaUser;
