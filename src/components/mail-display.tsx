import {
  Archive,
  ArchiveX,
  CircleIcon,
  Clock,
  CopyIcon,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  StarIcon,
  Trash2,
  Upload
} from 'lucide-react';

import {
  generateOTP,
  getMerchantId,
  validateOTPToken
} from '@/app/lib/actions';
import { Mail } from '@/data';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import { addDays, addHours, format, nextSaturday } from 'date-fns';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface MailDisplayProps {
  mail: Mail | null;
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date();
  const onboardingSteps = [
    'Start',
    'OTPSent',
    'OTPVerified',
    'MerchantIDCreated',
    'BrandCoverUploaded',
    'GSTValidated',
    'AccountValidated'
  ];
  const [currentState, setCurrentState] = useState('Start');

  const [phone, setPhone] = useState('');
  const [OTP, setOTP] = useState('');

  const validateStep = (step: string) => {
    console.log(
      '// strat',
      step,
      onboardingSteps?.findIndex(
        x => currentState?.toLowerCase() == x?.toLowerCase()
      ) >=
        onboardingSteps?.findIndex(x => x?.toLowerCase() == step?.toLowerCase())
    );
    return (
      onboardingSteps?.findIndex(
        x => currentState?.toLowerCase() == x?.toLowerCase()
      ) >=
      onboardingSteps?.findIndex(x => x?.toLowerCase() == step?.toLowerCase())
    );
  };

  const getOTP = async () => {
    try {
      const response = await generateOTP(phone);
      if (response?.data) {
        setCurrentState('OTPSent');
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
    }
  };

  const submitOTP = async () => {
    try {
      const sessionId = await validateOTPToken(phone, OTP);
      if (sessionId) {
        Cookies.set('sessionId', sessionId);
        setCurrentState('OTPVerified');
        const merchantId = await getMerchantId(phone, sessionId);
        if (merchantId) {
          Cookies.set('merchantId', merchantId); // Store merchantId in a cookie
          setCurrentState('MerchantIDCreated');
        } else {
          console.error('Failed to retrieve merchant ID');
        }
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
    }
  };

  const regisFn = (id: string) => {
    switch (id) {
      case 'first-onboarding':
        return (
          <div className='grid grid-cols-2 overflow-y-scroll'>
            {!validateStep('MerchantIDCreated') && (
              <Card className='max-w-sm'>
                <CardHeader className='space-y-1'>
                  <CardTitle className='text-2xl'>Create an account</CardTitle>
                  <CardDescription>
                    To get started with onboarding on SuperPe seller network,
                    please enter your phone number.
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='phone'>Phone</Label>
                    <Input
                      id='phone'
                      type='tel'
                      placeholder='9000400804'
                      autoFocus
                      value={phone}
                      maxLength={10}
                      minLength={10}
                      onChange={(e: any) => {
                        setPhone(e?.target?.value);
                      }}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='otp'>OTP</Label>
                    <InputOTP
                      id='otp'
                      maxLength={4}
                      value={OTP}
                      onChange={e => {
                        setOTP(e);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {validateStep('OTPVerified') && (
                    <div className='flex items-center justify-center'>
                      <CheckCircleIcon className='h-5 w-5 text-green-500' />
                      <span className='ml-2 text-green-500'>Verified</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {!validateStep('OTPVerified') && (
                    <Button
                      onClick={currentState === 'OTPSent' ? submitOTP : getOTP}
                    >
                      {currentState === 'OTPSent'
                        ? 'Verify OTP'
                        : 'Request OTP'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
            {!validateStep('BrandCoverUploaded') && (
              <Card className='overflow-hidden'>
                <CardHeader>
                  <CardTitle>Brand Assets</CardTitle>
                  <CardDescription>
                    Please upload your brand cover image for the checkout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-2'>
                    <Image
                      alt='Product image'
                      className='aspect-square w-full rounded-md object-cover'
                      height='300'
                      src='/placeholder.svg'
                      width='300'
                    />
                    <div className='grid grid-cols-3 gap-2'>
                      <button>
                        <Image
                          alt='Product image'
                          className='aspect-square w-full rounded-md object-cover'
                          height='84'
                          src='/placeholder.svg'
                          width='84'
                        />
                      </button>
                      <button>
                        <Image
                          alt='Product image'
                          className='aspect-square w-full rounded-md object-cover'
                          height='84'
                          src='/placeholder.svg'
                          width='84'
                        />
                      </button>
                      <button className='flex aspect-square w-full items-center justify-center rounded-md border border-dashed'>
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {!validateStep('GSTValidated') && (
              <Card className='max-w-sm'>
                <CardHeader className='space-y-1'>
                  <CardTitle className='text-2xl'>Company Details</CardTitle>
                  <CardDescription>
                    Please share your GSTIN details to complete the onboarding
                    check.
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='account'>GSTIN</Label>
                    <Input
                      id='account'
                      type='text'
                      placeholder='1234567890'
                      autoFocus
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>Create account</Button>
                </CardFooter>
              </Card>
            )}
            {!validateStep('AccountValidated') && (
              <Card className='max-w-sm'>
                <CardHeader className='space-y-1'>
                  <CardTitle className='text-2xl'>
                    Settlement Account Details
                  </CardTitle>
                  <CardDescription>
                    Please share your account details where the payments will be
                    settled.
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='account'>Account Number</Label>
                    <Input
                      id='account'
                      type='text'
                      placeholder='1234567890'
                      autoFocus
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='ifsc'>IFSC</Label>
                    <InputOTP id='ifsc' maxLength={11} type='text'>
                      <Input
                        id='account'
                        type='text'
                        placeholder='ABCD1234567'
                        maxLength={11}
                        minLength={11}
                        autoFocus
                      />
                    </InputOTP>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>Create account</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        );
      case 'second-integration':
        return (
          <div className='grid overflow-y-scroll'>
            <Card className='w-full'>
              <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl'>Integrate</CardTitle>
                <CardDescription>
                  Copy the code given below & proceed to add the same in your
                  theme.liquid file
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-4 overflow-hidden'>
                <pre className='mt-2 rounded-md bg-slate-800 p-4 text-wrap'>
                  <code className='text-white break-all'>{`<script src="https://feassetsnew.blob.core.windows.net/scripts/Integration.js"></script>`}</code>
                </pre>
              </CardContent>
              <CardFooter>
                <Button className='w-full'>
                  <CopyIcon className='w-4 h-4 mr-2' /> Copy Code
                </Button>
              </CardFooter>
            </Card>
          </div>
        );

      case 'third-golive':
        return (
          <Card>
            <CardHeader className='grid grid-cols-[1fr_110px] items-start gap-4 space-y-0'>
              <div className='space-y-1'>
                <CardTitle>Let's Go Live!</CardTitle>
                <CardDescription>
                  You're all set to go live. Let's do your first test
                  transaction now.
                </CardDescription>
              </div>
              <div className='flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground'>
                <Button variant='secondary' className='px-3 shadow-none'>
                  <StarIcon className='mr-2 h-4 w-4' />
                  Test now
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex space-x-4 text-sm text-muted-foreground'>
                <div className='flex items-center'>
                  <CircleIcon className={`mr-1 h-3 w-3 text-sky-400`} />
                  TypeScript
                </div>
                <div className='flex items-center'>
                  <StarIcon className='mr-1 h-3 w-3' />
                  20k
                </div>
                <div>Updated {`5 seconds ago`}</div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return 'no text';
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center p-2'>
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <Archive className='h-4 w-4' />
                <span className='sr-only'>Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <ArchiveX className='h-4 w-4' />
                <span className='sr-only'>Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <Trash2 className='h-4 w-4' />
                <span className='sr-only'>Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation='vertical' className='mx-1 h-6' />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' disabled={!mail}>
                    <Clock className='h-4 w-4' />
                    <span className='sr-only'>Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className='flex w-[535px] p-0'>
                <div className='flex flex-col gap-2 border-r px-2 py-4'>
                  <div className='px-4 text-sm font-medium'>Snooze until</div>
                  <div className='grid min-w-[250px] gap-1'>
                    <Button
                      variant='ghost'
                      className='justify-start font-normal'
                    >
                      Later today{' '}
                      <span className='ml-auto text-muted-foreground'>
                        {format(addHours(today, 4), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant='ghost'
                      className='justify-start font-normal'
                    >
                      Tomorrow
                      <span className='ml-auto text-muted-foreground'>
                        {format(addDays(today, 1), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant='ghost'
                      className='justify-start font-normal'
                    >
                      This weekend
                      <span className='ml-auto text-muted-foreground'>
                        {format(nextSaturday(today), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant='ghost'
                      className='justify-start font-normal'
                    >
                      Next week
                      <span className='ml-auto text-muted-foreground'>
                        {format(addDays(today, 7), 'E, h:m b')}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className='p-2'>
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <Reply className='h-4 w-4' />
                <span className='sr-only'>Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <ReplyAll className='h-4 w-4' />
                <span className='sr-only'>Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <Forward className='h-4 w-4' />
                <span className='sr-only'>Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation='vertical' className='mx-2 h-6' />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' disabled={!mail}>
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {mail ? (
        <div className='flex flex-1 flex-col'>
          <div className='flex items-start p-4'>
            <div className='flex items-start gap-4 text-sm'>
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(' ')
                    .map(chunk => chunk[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <div className='font-semibold'>{mail.name}</div>
                <div className='line-clamp-1 text-xs'>{mail.subject}</div>
                <div className='line-clamp-1 text-xs'>
                  <span className='font-medium'>email:</span> {mail.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className='ml-auto text-xs text-muted-foreground'>
                {format(new Date(mail.date), 'PPpp')}
              </div>
            )}
          </div>
          <Separator />
          <div className='flex-1 whitespace-pre-wrap p-4 text-sm'>
            {regisFn(mail?.id)}
          </div>
          <Separator className='mt-auto' />
          {/* <div className='p-4'>
            <form>
              <div className='grid gap-4'>
                <Textarea
                  className='p-4'
                  placeholder={`Reply ${mail.name}...`}
                />
                <div className='flex items-center'>
                  <Label
                    htmlFor='mute'
                    className='flex items-center gap-2 text-xs font-normal'
                  >
                    <Switch id='mute' aria-label='Mute thread' /> Mute this
                    thread
                  </Label>
                  <Button
                    onClick={e => e.preventDefault()}
                    size='sm'
                    className='ml-auto'
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div> */}
        </div>
      ) : (
        <div className='p-8 text-center text-muted-foreground'>
          No message selected
        </div>
      )}
    </div>
  );
}
