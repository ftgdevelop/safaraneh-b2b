import { getUserBalance } from "@/modules/payment/actions";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import Link from "next/link";
import { useEffect } from 'react';
import { numberWithCommas } from "@/modules/shared/helpers";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { setReduxBalance } from "@/modules/authentication/store/authenticationSlice";
import { CreditCard, DownCaret, Plus, TimeUpdate, Wallet2 } from "../ui/icons";


const UserWallet = () => {
    const dispatch = useAppDispatch();

    const balance = useAppSelector(state => state.authentication.balance);
    const balanceLoading = useAppSelector(state => state.authentication.balanceLoading);

    useEffect(() => {
        const fetchBalance = async () => {
            const token = localStorage.getItem('Token');
            if (token) {
                dispatch(setReduxBalance({ balance: undefined, loading: true }));
                const response: any = await getUserBalance(token, "IRR");
                if (response.data?.result?.amount !== null) {
                    dispatch(setReduxBalance({ balance: response?.data?.result?.amount, loading: false }))
                } else {
                    dispatch(setReduxBalance({ balance: undefined, loading: false }));
                }
            }
        }
        fetchBalance();
    }, []);


    return (
        <div className="group relative">
            <Link
                className="text-sm flex gap-1 items-center transition-all hover:bg-gray-100 py-1 px-2 rounded"
                href="/myaccount/wallet"
            >
                {balanceLoading ? (
                    <Skeleton className="mt-2 w-24" />
                ) : (
                    <>
                        <Wallet2 className="w-5 h-5 ml-1" />
                        {numberWithCommas(balance || 0)} ریال
                    </>
                )}

                <DownCaret className="w-5 h-5 fill-current" />
            </Link>
            <div 
                className="absolute top-full bg-white border rounded-lg text-sm whitespace-nowrap left-0 opacity-0 invisible transition-all origin-top-left scale-75 -mt-5 group-hover:mt-0 group-hover:scale-100 group-hover:opacity-100 group-hover:visible"
            >
                <Link href={"/"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <Plus className="w-5 h-5 fill-current"/>
                    پرداخت و افزایش اعتبار
                </Link>
                <Link href={"/"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <TimeUpdate className="w-5 h-5 fill-current"/>
                    تراکنش های آنلاین
                </Link>
                <Link href={"/"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <CreditCard className="w-5 h-5 fill-current" />
                    تراکنش های آفلاین
                </Link> 
            </div>
        </div>

    )
}
export default UserWallet;