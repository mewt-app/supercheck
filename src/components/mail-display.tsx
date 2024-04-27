import {
  CircleIcon,
  Clock,
  CopyIcon,
  Forward,
  MailIcon,
  MoreVertical,
  PhoneIcon,
  Reply,
  ReplyAll,
  StarIcon,
  Upload
} from 'lucide-react';

import {
  addBusinessDetails,
  generateOTP,
  getGstinDetails,
  getMerchantId,
  validateOTPToken,
  verifyBankAccount
} from '@/app/lib/actions';
import { Mail } from '@/data';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import { format } from 'date-fns';
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
  DropdownMenuSeparator,
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
  const [imageBase64, setImageBase64] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [isGstinVerified, setGstinVerified] = useState(false);
  const [isAccountVerified, setAccountVerified] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [gstin, setGstin] = useState('');

  const validateStep = (step: string) => {
    // console.log(
    //   '// strat',
    //   step,
    //   onboardingSteps?.findIndex(
    //     x => currentState?.toLowerCase() == x?.toLowerCase()
    //   ) >=
    //     onboardingSteps?.findIndex(x => x?.toLowerCase() == step?.toLowerCase())
    // );
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

  // Function to convert image to base64
  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Split the result to extract the base64 part
      const result = reader.result;
      const match = result?.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        const base64String = match[2];
        setImageBase64(base64String); // Set the state with just the base64 string
        console.log('Base64 String:', base64String);
        setCurrentState('BrandCoverUploaded');
      } else {
        console.error('Failed to parse the base64 string.');
      }
    };

    reader.onerror = error => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file); // Start the file reading process which triggers `onload`
  };

  const handleVerifyGstin = async () => {
    try {
      const merchantId = Cookies.get('merchantId');
      const sessionId = Cookies.get('sessionId');
      const details =
        merchantId && (await getGstinDetails(merchantId, gstin, sessionId));
      if (details) {
        setCompanyDetails(details.gstin_trade_name);
        setGstinVerified(true);
      }
    } catch (error) {
      console.error('Error fetching GSTIN details:', error);
    }
  };

  const handleNextAccount = () => {
    console.log('Account creation logic here');
    setCurrentState('GSTValidated');
  };

  const handleVerifyAccount = async () => {
    const merchantId = Cookies.get('merchantId');
    const sessionId = Cookies.get('sessionId');

    if (!merchantId || !sessionId) {
      console.error('Session ID or Merchant ID is missing');
      return;
    }

    try {
      const nameOnBank = await verifyBankAccount(
        accountNumber,
        ifscCode,
        merchantId,
        sessionId
      );
      setBankName(nameOnBank);
      setAccountVerified(true);
    } catch (error) {
      console.error('Error during bank account verification:', error);
    }
  };

  const handleAddBusinessDetails = async () => {
    const merchantId = Cookies.get('merchantId');
    const sessionId = Cookies.get('sessionId');
    const cardBgImg = imageBase64;

    if (!merchantId || !sessionId) {
      console.error('Session ID or Merchant ID is missing');
      return;
    }

    try {
      const result = await addBusinessDetails(
        cardBgImg,
        merchantId,
        gstin,
        accountNumber,
        ifscCode,
        sessionId
      );
      console.log('Business details added:', result);
      if (result) {
        console.log('Bussiness account got created ', result);
        Cookies.set('beneId', result.beneId);
        Cookies.set('merchantId', result.merchantId);
        setCurrentState('AccountValidated');
      }
    } catch (error) {
      console.error('Error adding business details:', error);
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
                  {currentState === 'OTPSent' && (
                    <div className='grid gap-2'>
                      <Label htmlFor='otp'>OTP</Label>
                      <InputOTP
                        id='otp'
                        maxLength={4}
                        value={OTP}
                        autoFocus={currentState === 'OTPSent'}
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
                  )}
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
            {!validateStep('BrandCoverUploaded') &&
              validateStep('MerchantIDCreated') && (
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
                        className='aspect-rect w-full rounded-md object-cover bg-transparent'
                        height='300'
                        width='300'
                        src={
                          'https://cdn.dribbble.com/userupload/14048261/file/original-046c06bfb2eb83d01e6d3c4ef3f64d02.jpg?resize=1504x1128'
                        }
                      />
                      <div className='grid grid-cols-3 gap-2'>
                        <button>
                          <Image
                            alt='Product image'
                            className='aspect-square w-full rounded-md object-cover'
                            height='84'
                            src='https://cdn.dribbble.com/userupload/13945651/file/original-72096e24dd7ec1f59641e9007674ac13.jpg?resize=1504x1135'
                            width='84'
                          />
                        </button>
                        <button>
                          <Image
                            alt='Product image'
                            className='aspect-square w-full rounded-md object-cover'
                            height='84'
                            src='https://cdn.dribbble.com/userupload/13957876/file/original-49ccb955300a89d80b46db59b15bffbf.png?resize=2048x1536'
                            width='84'
                          />
                        </button>
                        <button>
                          <Image
                            alt='Brand cover placeholder'
                            className='aspect-square w-full rounded-md object-cover'
                            height='84'
                            src='https://images.unsplash.com/photo-1633533452148-a9657d2c9a5f?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                            width='84'
                          />
                        </button>
                        <label className='flex aspect-square w-full items-center justify-center rounded-md border border-dashed cursor-pointer'>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageUpload}
                            style={{ display: 'none' }} // Hide the actual input element
                          />
                          <Upload className='h-4 w-4 text-muted-foreground' />
                          <span className='sr-only'>Upload</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            {!validateStep('GSTValidated') &&
              validateStep('BrandCoverUploaded') && (
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
                      <Label htmlFor='gstin'>GSTIN</Label>
                      <Input
                        id='gstin'
                        type='text'
                        placeholder='1234567890ABCDEF'
                        autoFocus
                        value={gstin}
                        onChange={e => {
                          console.log('Before setting GSTIN:', gstin);
                          setGstin(e.target.value);
                          console.log('After setting GSTIN:', e.target.value);
                        }}
                      />
                      {isGstinVerified && (
                        <div className='text-green-500'>
                          TRADE NAME - {companyDetails}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className='w-full'
                      onClick={
                        !isGstinVerified ? handleVerifyGstin : handleNextAccount
                      }
                    >
                      {!isGstinVerified ? 'Verify GSTIN' : 'Continue'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            {!validateStep('AccountValidated') &&
              validateStep('GSTValidated') && (
                <Card className='max-w-sm'>
                  <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl'>
                      Settlement Account Details
                    </CardTitle>
                    <CardDescription>
                      Please share your account details where the payments will
                      be settled.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='accountNumber'>Account Number</Label>
                      <Input
                        id='accountNumber'
                        type='text'
                        placeholder='Account Number'
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='ifscCode'>IFSC Code</Label>
                      <Input
                        id='ifscCode'
                        type='text'
                        placeholder='IFSC Code'
                        value={ifscCode}
                        onChange={e => setIfscCode(e.target.value)}
                      />
                    </div>
                    {isAccountVerified && (
                      <div className='text-green-500'>
                        NAME FROM BANK: {bankName}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className='w-full'
                      onClick={
                        !isAccountVerified
                          ? handleVerifyAccount
                          : handleAddBusinessDetails
                      }
                    >
                      {!isAccountVerified ? 'Verify Account' : 'Create Account'}
                    </Button>
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
        return mail?.text;
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center p-2'>
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <MailIcon className='h-4 w-4' />
                <span className='sr-only'>Email SuperPe</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Email SuperPe</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' disabled={!mail}>
                <PhoneIcon className='h-4 w-4' />
                <span className='sr-only'>Call SuperPe</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Call SuperPe</TooltipContent>
          </Tooltip>
          <Separator orientation='vertical' className='mx-1 h-6' />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' disabled={!mail}>
                    <Clock className='h-4 w-4' />
                    <span className='sr-only'>Time Check</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className='flex w-[535px] p-0'>
                <div className='flex flex-col gap-2 border-r px-2 py-4'>
                  <div className='px-4 text-sm font-medium'>Plan</div>
                </div>
                <div className='p-2'>
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Plan</TooltipContent>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-red-500'>Logout</DropdownMenuItem>
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
                  {mail.name.replace(/[^\w\s]/gi, '')[0]}
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
