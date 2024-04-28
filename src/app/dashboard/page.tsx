import { Mail } from '@/components/mail';
import { accounts } from '@/data';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { fetchEmailsBene } from '../lib/actions';

const Home = async () => {
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  const beneId = String(cookies().get('beneId'));

  var data: [];

  await fetchEmailsBene(beneId).then(response => {
    console.log('//from page ', response?.emails);
    data = response?.emails;
  });

  // const beneId = Cookies.get('beneId');

  return (
    <>
      <div className='md:hidden'>
        <Image
          src='/examples/mail-dark.png'
          width={1280}
          height={727}
          alt='Mail'
          className='hidden dark:block'
        />
        <Image
          src='/examples/mail-light.png'
          width={1280}
          height={727}
          alt='Mail'
          className='block dark:hidden'
        />
      </div>
      <div className='hidden flex-col md:flex'>
        <Mail
          accounts={accounts}
          mails={data}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
};

export default Home;
