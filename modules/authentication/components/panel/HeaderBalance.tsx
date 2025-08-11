import { getTenantBalances } from "@/modules/payment/actions";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import Link from "next/link";
import { useEffect } from 'react';
import { numberWithCommas, returnCurrency } from "@/modules/shared/helpers";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { setReduxBalance } from "@/modules/authentication/store/authenticationSlice";
import { CreditCard, DownCaret, Plus, TimeUpdate, Wallet2 } from "../../../shared/components/ui/icons";


const HeaderBalance = () => {
    const dispatch = useAppDispatch();

    const balances = useAppSelector(state => state.authentication.balances);
    const balanceLoading = useAppSelector(state => state.authentication.balanceLoading);

    const token = localStorage.getItem('Token');
    const tenantId = localStorage.getItem('S-TenantId');
    
    useEffect(() => {
        const fetchBalance = async (userToken:string, tenant: number) => {            
            
            dispatch(setReduxBalance({ balances: [], loading: true }));
            
            const response: any = await getTenantBalances(userToken,tenant);

            const balances : {
                amount: number;
                creationTime:string;
                currencyType:string;
                lastModificationTime?:string;
                userId:number;
            }[] = response?.data?.result || [];

            if (balances.length) {
                dispatch(setReduxBalance({ balances: balances , loading: false }))
            } else {
                dispatch(setReduxBalance({ balances: [], loading: false }));
            }
        }
        if (token && tenantId) {
            fetchBalance(token, +tenantId);
        }
    }, [token, tenantId]);


    return (
        <div className="group relative">
            <Link
                className="text-2xs flex gap-1 justify-between items-center transition-all hover:bg-gray-100 py-1 px-2 rounded-lg border md:min-w-44"
                href="/wallet"
            >
                {balanceLoading ? (
                    <Skeleton className="mt-2 w-24" />
                ) : (
                    <div className="flex gap-2 items-center">
                        <span className="p-1 rounded bg-neutral-100 block transition-all group-hover:bg-neutral-200">
                            <Wallet2 className="w-4.5 h-4.5" />
                        </span>
                        <span className="hidden md:block">
                            {numberWithCommas(balances?.[0]?.amount || 0)} {returnCurrency(balances?.[0]?.currencyType)}
                        </span>
                    </div>
                )}

                <DownCaret className="w-5 h-5 fill-current" />
            </Link>
            <div 
                className="absolute top-full bg-white border rounded-lg text-2xs whitespace-nowrap left-0 opacity-0 delay-200 invisible transition-all origin-top-left scale-75 -mt-5 group-hover:mt-0 group-hover:scale-100 group-hover:opacity-100 group-hover:visible group-hover:delay-0"
            >
                <Link href={"/wallet/deposit"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <Plus className="w-5 h-5 fill-current"/>
                    پرداخت و افزایش اعتبار
                </Link>
                <Link href={"/wallet/transactions"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <TimeUpdate className="w-5 h-5 fill-current"/>
                    تراکنش های آنلاین
                </Link>
                <Link href={"/wallet/offline-transactions"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <CreditCard className="w-5 h-5 fill-current" />
                    تراکنش های آفلاین
                </Link> 
            </div>
        </div>

    )
}
export default HeaderBalance;