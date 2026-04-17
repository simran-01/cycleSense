"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import ChatPanel from './ChatPanel';
import { useCycle } from '@/context/CycleContext';

const ChatContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cycleInfo, loading } = useCycle();

  return (
    <>
      <Button
        className="fixed bottom-24 right-6 h-16 w-16 rounded-full bg-primary shadow-lg transition-transform hover:scale-110 hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Chat"
      >
        <Sparkles className="h-8 w-8 text-primary-foreground" />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-0 border-l-primary/20"
          side="right"
        >
          {loading || !cycleInfo ? (
            <div>Loading...</div>
          ) : (
            <ChatPanel cycleInfo={cycleInfo} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatContainer;
