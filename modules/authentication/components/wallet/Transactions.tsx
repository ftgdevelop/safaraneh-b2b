import { getTransactionDeposit } from '@/modules/payment/actions';
import { GetTransactionParams } from '@/modules/payment/types';
import { useEffect, useState } from 'react';
import TransactionItem from './TransactionItem';
import Skeleton from '@/modules/shared/components/ui/Skeleton';
import Pagination from '@/modules/shared/components/ui/Pagination';
import { ErrorCircle } from '@/modules/shared/components/ui/icons';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { setReduxError } from '@/modules/shared/store/errorSlice';
import { useTranslation } from 'next-i18next';

const Transactions: React.FC = () => {

    const dispatch = useAppDispatch();
    const {t} = useTranslation('common');

    const [transactionList, setTransactionList] = useState<any[]>([]);
    const [total, setTotal] = useState<number>();
    const [page, setPage] = useState<number>(1);
    const [transactionLoading, setTransactionLoading] = useState<boolean>(false);

    const fetchTransactions = async (params: GetTransactionParams) => {
        const token = localStorage.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!token || !localStorageTenant) return;

        setTransactionLoading(true);

        const response: any = await getTransactionDeposit(params, +localStorageTenant, token, "en-US");

        setTransactionLoading(false);

        if (response?.data?.result?.items) {
            setTotal(response.data.result.totalCount)
            setTransactionList(response.data.result.items);
        } else {
            dispatch(setReduxError({
                title: t('error'),
                message: response?.response?.data?.error?.message || "خطا در ارسال درخواست!",
                isVisible: true
            }))
        }

    }

    useEffect(() => {
        fetchTransactions(
            {
                CurrencyType: "IRR",
                MaxResultCount: 10,
                SkipCount: (page - 1)*10
            }
        );
    }, [page]);

    return (
        <>
            <div className='my-5 overflow-auto'>
                {transactionLoading || transactionList.length ? (
                    <div>
                        <table className='w-full text-xs'>
                            <thead>
                                <tr>
                                    <th className='bg-gray-100 '>  </th>
                                    <th className='bg-gray-100 rtl:text-right ltr:text-left p-3 text-sm font-semibold'> زمان </th>
                                    <th className='bg-gray-100 rtl:text-right ltr:text-left p-3 text-sm font-semibold'> نوع تراکنش </th>
                                    <th className='bg-gray-100 rtl:text-right ltr:text-left p-3 text-sm font-semibold'> مبلغ </th>
                                    <th className='bg-gray-100 rtl:text-right ltr:text-left p-3 text-sm font-semibold'> باقی مانده </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!!(transactionLoading && !transactionList.length) && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(loadingItem => <tr key={loadingItem} className='border-t border-neutral-300'>
                                    {[1, 2, 3, 4, 5].map(skeletonItem => <td key={skeletonItem} className='p-1 md:p-5'> <Skeleton className='h-5' /> </td>)}
                                </tr>)}
                                {transactionList.map(transactionItem => <TransactionItem data={transactionItem} key={transactionItem.id} />)}
                            </tbody>
                        </table>
                    </div>
                ):(
                    <div className='border border-neutral-300 bg-neutral-50 rounded my-5 flex items-center justify-center gap-3 p-5'>
                        <ErrorCircle className='w-6 h-6 fill-neutral-500' />
                        <strong className='font-demibold'>
                            تراکنشی یافت نشد!
                        </strong>
                    </div>
                )}
            </div>

            {!!(total && total > 10) && <Pagination
                onChange={setPage}
                totalItems={total}
                currentPage={page}
            />}
        </>
    )
}

export default Transactions;