import { useEffect, useState } from "react";
import { getUserPermissionsForEdit, updateUser, updateUserPermissions } from "../../actions";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import Button from "@/modules/shared/components/ui/Button";
import CheckboxGroup from "@/modules/shared/components/ui/CheckboxGroup";
import Skeleton from "@/modules/shared/components/ui/Skeleton";

type Props = {
    userId: number;
    tenant: number;
    token: string;
}

type PermissionItem = {
    name?: string;
    displayName?: string;
    isGrantedByDefault: boolean;
}

const EditUserPermissions: React.FC<Props> = props => {

    const dispatch = useAppDispatch();

    const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
    const [activePermissions, setActivePermissions] = useState<string[]>([]);


    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const { tenant, token, userId } = props;

    useEffect(() => {
        const fetchUserPermissions = async () => {
            
            setLoading(true);
            
            const response: any = await getUserPermissionsForEdit({
                tenant:tenant,
                token: token,
                userId: userId
            });
            
            setLoading(false);

            if (response?.data?.result) {
                setAllPermissions(response.data.result.permissions);
                setActivePermissions(response.data.result.grantedPermissionNames);
            }
        }

        fetchUserPermissions();

    }, []);


    const submitHandler = async () => {

        if (!token || !tenant) return;

        setSubmitLoading(true);

        const response: any = await updateUserPermissions(
            {
                tenantId: tenant,
                token: token,
                grantedPermissionNames: activePermissions,
                userId: userId
            }
        )
        setSubmitLoading(false);

        if (response.data.success) {
            dispatch(setReduxNotification({
                status: 'success',
                message: `تغییرات کاربر ثبت شد.`,
                isVisible: true
            }));
        }
    }


    const checkboxItems: { value: string, label: React.ReactNode }[] = allPermissions?.filter(item => item.name).map(item => ({
        label: item.displayName,
        value: item.name!
    })) || [];

    let content: React.ReactNode = <CheckboxGroup 
        items={checkboxItems}
        onChange={values => {setActivePermissions(values)}}
        values={activePermissions}
        noMultipleWrappers
    />

    if (loading){
        content = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(item => (
        <Skeleton 
            key={item}
            className="w-2/3 mt-2 mb-3"
        />
    ))}

    return (
        <div className="bg-white border rounded-xl p-5 md:p-8 mb-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-5">
                {content}
            </div>

            <Button
                loading={submitLoading}
                type="button"
                onClick={submitHandler}
                disabled={loading}
                className={`px-5 h-12`}
            >
                ذخیره تغییرات
            </Button>
        </div>
    )
}

export default EditUserPermissions;