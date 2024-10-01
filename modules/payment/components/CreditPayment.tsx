import { useState } from 'react';
import Button from "@/modules/shared/components/ui/Button";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { Loading, Plus, Wallet } from "@/modules/shared/components/ui/icons";
import { numberWithCommas } from "@/modules/shared/helpers";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import Link from "next/link";
import { confirmByDeposit, getUserBalance } from "../actions";
import { useRouter } from "next/router";
import { setReduxBalance } from '@/modules/authentication/store/authenticationSlice';

type Props = {
    price?: number;
}

const CreditPayment: React.FC<Props> = props => {

    const dispatch = useAppDispatch();

    const balance = useAppSelector(state => state.authentication.balance);
    const balanceLoading = useAppSelector(state => state.authentication.balanceLoading);
    const userIsAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

    let balanceElement: React.ReactNode = balanceLoading ? <Skeleton /> : 0;
    if (balance) {
        balanceElement = `${numberWithCommas(balance)} ریال`;
    }

    const router = useRouter();

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const updateUserBalance = async (token: string, tenantId: number) => {
        dispatch(setReduxBalance({ balance: undefined, loading: true }));
        const response: any = await getUserBalance(token, tenantId, "IRR");
        if (response.data?.result?.amount !== null) {
            dispatch(setReduxBalance({ balance: response?.data?.result?.amount, loading: false }))
        } else {
            dispatch(setReduxBalance({ balance: undefined, loading: false }));
        }
    }

    const submitHandler = async () => {
        setErrorMessage('');
        setSubmitLoading(true);

        const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");
        const username: string | undefined = pathArray.find(item => item.includes("username="))?.split("username=")[1];
        const reserveId: string | undefined = pathArray.find(item => item.includes("reserveId="))?.split("reserveId=")[1];

        const token = localStorage.getItem('Token');        
        const tenantId = localStorage.getItem('S-TenantId');

        if (!username || !reserveId || !token || !tenantId) return;

        const response: any = await confirmByDeposit({ username: username, reserveId: +reserveId }, token);

        if (response.status === 200 && response.data && response.data.result) {

            await updateUserBalance(token, +tenantId);

            const callbackUrl = `/callback?reserveId=${reserveId}&username=${username}&status=${response.data.result.isSuccess}`
            router.replace(callbackUrl)

        } else {
            setSubmitLoading(false);
            setErrorMessage(response.response?.data?.error?.message);
        }
    }
    if (!userIsAuthenticated){
        return (
            <div className='py-8'>
                برای پرداخت اعتباری لطفا ابتدا وارد سایت شوید.
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="flex justify-between items-center gap-5 mb-4 sm:mb-6">
                <div className="text-lg"> پرداخت با استفاده از کیف پول؟ </div>
                <Link
                    href="/myaccount/wallet"
                    target="_blank"
                    className="text-blue-500 font-semibold text-sm"
                >
                    <Plus className="w-7 h-7 fill-current inline-block" />  افزایش اعتبار
                </Link>
            </div>

            <div className="font-semibold mb-1 text-sm">
                کل مبلغ پرداخت : {numberWithCommas(props.price || 0)} ریال
            </div>
            <div className="font-semibold mb-5 text-sm">
                موجودی کیف پول شما : {balanceElement}
            </div>

            {errorMessage && <p className="my-4 text-xs text-red-500">{errorMessage} </p>}

            <Button
                className="h-12 px-5 w-full sm:w-60 outline-none"
                disabled={submitLoading || !balance || !props.price || props.price > balance}
                onClick={submitHandler}
            >
                {submitLoading ? (
                    <Loading className="w-5 h-5 fill-current inline-block animate-spin rtl:ml-1 ltr:mr-1" />
                ) : (
                    <Wallet className="w-5 h-5 fill-current inline-block rtl:ml-1 ltr:mr-1" />
                )}

                پرداخت

            </Button>

            {(!balanceLoading && props.price && (balance === 0 || balance && balance < props.price)) && (
                <p className="text-xs text-red-500 mt-3">
                    موجودی کیف پول شما کمتر از مبلغ پرداخت است. لطفا اعتبار کیف پول خود را افزایش دهید.
                </p>
            )}

        </div>
    )
}

export default CreditPayment;