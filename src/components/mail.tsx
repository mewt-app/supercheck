'use client';

import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useMail } from '@/use-mail';
import { AccountSwitcher } from './account-switcher';
import { MailDisplay } from './mail-display';
import { MailList } from './mail-list';
import { Nav } from './nav';
import { Input } from './ui/input';
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TooltipProvider } from './ui/tooltip';

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [165, 440, 755],
  defaultCollapsed = false,
  navCollapsedSize
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction='horizontal'
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className='h-full max-h-[800px] items-stretch'
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed: any) => {
            setIsCollapsed(collapsed);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              collapsed
            )}`;
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out'
          )}
        >
          <div
            className={cn(
              'flex h-[52px] items-center justify-center',
              isCollapsed ? 'h-[52px]' : 'px-2'
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Inbox',
                label: '128',
                icon: Inbox,
                variant: 'default'
              },
              {
                title: 'Drafts',
                label: '9',
                icon: File,
                variant: 'ghost'
              },
              {
                title: 'Sent',
                label: '',
                icon: Send,
                variant: 'ghost'
              },
              {
                title: 'Junk',
                label: '23',
                icon: ArchiveX,
                variant: 'ghost'
              },
              {
                title: 'Trash',
                label: '',
                icon: Trash2,
                variant: 'ghost'
              },
              {
                title: 'Archive',
                label: '',
                icon: Archive,
                variant: 'ghost'
              }
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Social',
                label: '972',
                icon: Users2,
                variant: 'ghost'
              },
              {
                title: 'Updates',
                label: '342',
                icon: AlertCircle,
                variant: 'ghost'
              },
              {
                title: 'Forums',
                label: '128',
                icon: MessagesSquare,
                variant: 'ghost'
              },
              {
                title: 'Shopping',
                label: '8',
                icon: ShoppingCart,
                variant: 'ghost'
              },
              {
                title: 'Promotions',
                label: '21',
                icon: Archive,
                variant: 'ghost'
              }
            ]}
          />
        </ResizablePanel>
        {/* <ResizableHandle withHandle /> */}
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue='all'>
            <div className='flex items-center px-4 py-2'>
              <h1 className='text-xl font-bold'>Inbox</h1>
              <TabsList className='ml-auto'>
                <TabsTrigger
                  value='all'
                  className='text-zinc-600 dark:text-zinc-200'
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value='unread'
                  className='text-zinc-600 dark:text-zinc-200'
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className='bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <form>
                <div className='relative'>
                  <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input placeholder='Search' className='pl-8' />
                </div>
              </form>
            </div>
            <TabsContent value='all' className='m-0'>
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value='unread' className='m-0'>
              <MailList items={mails?.filter(item => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        {/* <ResizableHandle withHandle /> */}
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay
            mail={mails?.find(item => item.id === mail.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
