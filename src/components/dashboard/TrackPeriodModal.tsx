"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCycle } from '@/context/CycleContext';
import { type PeriodFlow } from '@/lib/cycle-data';

interface TrackPeriodModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const TrackPeriodModal: React.FC<TrackPeriodModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const { trackPeriod } = useCycle();
  const [flow, setFlow] = useState<PeriodFlow>('Light');

  const handleConfirm = () => {
    trackPeriod(flow);
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Track Your Period</DialogTitle>
          <DialogDescription>
            Select your current flow intensity. This will mark today as Day 1 of your cycle.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            defaultValue="Light"
            className="flex justify-around"
            onValueChange={(value: PeriodFlow) => setFlow(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Light" id="r1" />
              <Label htmlFor="r1">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Medium" id="r2" />
              <Label htmlFor="r2">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Heavy" id="r3" />
              <Label htmlFor="r3">Heavy</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrackPeriodModal;
