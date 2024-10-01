import {  useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getReserveFromCoordinator } from '@/modules/shared/actions';
import { useRouter } from 'next/router';
import Loading from '@/modules/shared/components/ui/Loading';


const Callback: NextPage = () => {

  const router = useRouter();

  const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");
  const username: string | undefined = pathArray.find(item => item.includes("username="))?.split("username=")[1];
  const reserveId: string | undefined = pathArray.find(item => item.includes("reserveId="))?.split("reserveId=")[1];
  const status: string | undefined = pathArray.find(item => item.includes("status="))?.split("status=")[1];


  useEffect(() => {
    const fetchType = async () => {

      if (username && reserveId) {
        const response: any = await getReserveFromCoordinator({ reserveId: reserveId, username: username });
        if (response.status == 200) {
          if (!status || status === "0" || status === "false") {
            router.push(`/payment?username=${username}&reserveId=${reserveId}&status=0`);
          } else if (status && status === "1" || status === "true") {
            if (response.data.result.type === "Hotel") {
              // router.push(
              //   `/hotel-foreign/booking?username=${username}&reserveId=${reserveId}`
              // );
            } else if (response.data.result.type === "Cip") {
              router.push(
                `/cip/booking?username=${username}&reserveId=${reserveId}`
              );
            } else if (response.data.result.type === "FlightDomestic") {
              router.push(
                `/flights/booking?username=${username}&reserveId=${reserveId}`
              );
            } else if (response.data.result.type === "HotelDomestic") {
              router.push(`/hotel/booking?username=${username}&reserveId=${reserveId}`);
            } else if (response.data.result.type === "Flight") {
              // router.push(
              //   `/flights-foreign/booking?username=${username}&reserveId=${reserveId}`
              // );
            }
          }
        }

      }
    }

    fetchType();

  }, [reserveId, username, status]);


  return (
    <>

      <div className='h-80 flex items-center justify-center'>

        <Loading bgGray size='large' />

      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {

  return ({
    props: {
      ...await (serverSideTranslations(context.locale, ['common', 'hotel', 'payment']))

    },
  })
}

export default Callback;
