"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { aiCycleChatbotInteraction } from '@/ai/flows/ai-cycle-chatbot-interaction';
import type { CycleInfo } from '@/lib/cycle-data';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';

interface ChatPanelProps {
  cycleInfo: CycleInfo;
}

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string | React.ReactNode;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ cycleInfo }) => {
  const logs = cycleInfo.logs;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === todayStr);

  const isPredictedToday = String(todayLog?.isPredicted).toLowerCase() === 'true';
  const hasFlowData = todayLog?.period && String(todayLog.period).trim() !== '';
  const isTrackedToday = todayLog?.phase === 'Menstrual' && hasFlowData;

  let botPhase: string = todayLog?.phase || '';
  let botDay: number = todayLog?.cycleDay || 1;

  if (isPredictedToday && !isTrackedToday) {
    botPhase = 'Extended Luteal';
    const lastActualStart = logs.findLast(log => Number(log.cycleDay) === 1 && String(log.isPredicted).toLowerCase() !== 'true');
    if (lastActualStart?.date) {
      const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(lastActualStart.date).getTime());
      botDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  const nextPeriodDateStr = logs[0]?.next_period_date;
  let dynamicLateDays = 0;
  if (nextPeriodDateStr) {
    const todayDateObj = new Date(todayStr);
    const expectedDateObj = new Date(nextPeriodDateStr);
    dynamicLateDays = Math.max(0, Math.floor((todayDateObj.getTime() - expectedDateObj.getTime()) / (1000 * 60 * 60 * 24)));
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'bot',
      content: `Hello! I'm your CycleSense assistant. How can I help you today? I see you're on day ${botDay} of your cycle.`,
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const onSubmit = async (data: ChatFormValues) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: data.message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    form.reset();

    try {
      const response = await aiCycleChatbotInteraction({
        chatMessage: data.message,
        currentCycleDay: botDay,
        currentCyclePhase: botPhase,
        daysLate: dynamicLateDays,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <SheetHeader className="flex-row items-center gap-4 space-y-0 border-b p-4 text-left sm:text-left">
        <Sparkles className="h-6 w-6 text-primary" />
        <div className='flex-1'>
            <SheetTitle className="font-headline text-xl font-normal">CycleSense AI</SheetTitle>
            <SheetDescription className="text-xs">Your personal health assistant</SheetDescription>
        </div>
      </SheetHeader>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(message.role === 'bot' && 'bg-primary text-primary-foreground')}>
                  {message.role === 'bot' ? <Sparkles className="h-4 w-4" /> : 'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl p-3 text-sm',
                  message.role === 'user'
                    ? 'rounded-br-none bg-muted'
                    : 'rounded-bl-none bg-secondary'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isThinking && (
             <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] rounded-2xl p-3 text-sm rounded-bl-none bg-secondary">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0s' }}></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.2s' }}></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Ask about your cycle..."
                      {...field}
                      autoComplete="off"
                      disabled={isThinking}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isThinking}>
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChatPanel;
