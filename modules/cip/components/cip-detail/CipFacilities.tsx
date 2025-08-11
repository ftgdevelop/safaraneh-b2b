import { CipGetAirportByUrlResponseType } from '../../types/cip';

type Props = {
    facilities?: CipGetAirportByUrlResponseType['facilities'];
}

const CipFacilities: React.FC<Props> = props => {
    const { facilities } = props;
    
    const theme2 = process.env.THEME === "THEME2";

    return (
        <div className='py-2 md:py-5'>
            <strong className="block font-semibold text-lg mb-5"> امکانات فرودگاه </strong>

            <div className={`inserted-content text-base leading-8 ${theme2?"py-5":"bg-white rounded-lg border border-neutral-300 p-5 md:p-8"}`}>
                {facilities?.map((item, index) => (
                    <div key={item.id} className={`grid grid-cols-1 sm:grid-cols-4 gap-5 ${index ? "mt-5 md:mt-8" : ""}`}>

                        <div className="bg-neutral-100 p-5 flex flex-col gap-3 items-center justify-center rounded-xl">
                            <img
                                src={item.picture?.path || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDU1LjQzMSA0NTUuNDMxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTUuNDMxIDQ1NS40MzE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiM4REM2NDA7IiBkPSJNNDA1LjQ5Myw0MTIuNzY0Yy02OS42ODksNTYuODg5LTI4Ny4yODksNTYuODg5LTM1NS41NTYsMGMtNjkuNjg5LTU2Ljg4OS02Mi41NzgtMzAwLjA4OSwwLTM2NC4wODkNCglzMjkyLjk3OC02NCwzNTUuNTU2LDBTNDc1LjE4MiwzNTUuODc2LDQwNS40OTMsNDEyLjc2NHoiLz4NCjxnIHN0eWxlPSJvcGFjaXR5OjAuMjsiPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjI5LjEzOCwzMTMuMjA5Yy02Mi41NzgsNDkuNzc4LTEzMi4yNjcsNzUuMzc4LTE5Ny42ODksNzYuOA0KCQljLTQ4LjM1Ni04Mi40ODktMzguNC0yODMuMDIyLDE4LjQ4OS0zNDEuMzMzYzUxLjItNTIuNjIyLDIxMS45MTEtNjIuNTc4LDMwNC4zNTYtMjkuODY3DQoJCUMzNzcuMDQ5LDExMi42NzYsMzMwLjExNiwyMzIuMTQyLDIyOS4xMzgsMzEzLjIwOXoiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMTk1LjAwNCwzNTQuNDUzYy05Ljk1NiwwLTE5LjkxMS00LjI2Ny0yNS42LTEyLjhsLTc5LjY0NC0xMDIuNA0KCWMtMTEuMzc4LTE0LjIyMi04LjUzMy0zNC4xMzMsNS42ODktNDUuNTExczM0LjEzMy04LjUzMyw0NS41MTEsNS42ODlsNTQuMDQ0LDY5LjY4OWwxMTkuNDY3LTE1NS4wMjINCgljMTEuMzc4LTE0LjIyMiwzMS4yODktMTcuMDY3LDQ1LjUxMS01LjY4OXMxNy4wNjcsMzEuMjg5LDUuNjg5LDQ1LjUxMUwyMjAuNjA0LDM0MS42NTMNCglDMjEzLjQ5MywzNDguNzY0LDIwNC45NiwzNTQuNDUzLDE5NS4wMDQsMzU0LjQ1M3oiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K"}
                                alt={item.picture?.altAttribute}
                                title={item.picture?.titleAttribute}
                                className='w-10 h-10 sm:w-16 sm:h-16'
                            />
                            <strong className='block text-sm font-semibold'>{item.name}</strong>
                        </div>

                        <div className='text-xs sm:col-span-3 leading-5'>
                            {item.description?.split(',').map((facilityItem, facilityIndex) => <div key={facilityItem} className={facilityIndex ? "mt-3" : ""}>
                                <img
                                    className='w-5 h-5 inline-block rtl:ml-2 ltr:mr-2'
                                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDU1LjQzMSA0NTUuNDMxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTUuNDMxIDQ1NS40MzE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiM4REM2NDA7IiBkPSJNNDA1LjQ5Myw0MTIuNzY0Yy02OS42ODksNTYuODg5LTI4Ny4yODksNTYuODg5LTM1NS41NTYsMGMtNjkuNjg5LTU2Ljg4OS02Mi41NzgtMzAwLjA4OSwwLTM2NC4wODkNCglzMjkyLjk3OC02NCwzNTUuNTU2LDBTNDc1LjE4MiwzNTUuODc2LDQwNS40OTMsNDEyLjc2NHoiLz4NCjxnIHN0eWxlPSJvcGFjaXR5OjAuMjsiPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjI5LjEzOCwzMTMuMjA5Yy02Mi41NzgsNDkuNzc4LTEzMi4yNjcsNzUuMzc4LTE5Ny42ODksNzYuOA0KCQljLTQ4LjM1Ni04Mi40ODktMzguNC0yODMuMDIyLDE4LjQ4OS0zNDEuMzMzYzUxLjItNTIuNjIyLDIxMS45MTEtNjIuNTc4LDMwNC4zNTYtMjkuODY3DQoJCUMzNzcuMDQ5LDExMi42NzYsMzMwLjExNiwyMzIuMTQyLDIyOS4xMzgsMzEzLjIwOXoiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMTk1LjAwNCwzNTQuNDUzYy05Ljk1NiwwLTE5LjkxMS00LjI2Ny0yNS42LTEyLjhsLTc5LjY0NC0xMDIuNA0KCWMtMTEuMzc4LTE0LjIyMi04LjUzMy0zNC4xMzMsNS42ODktNDUuNTExczM0LjEzMy04LjUzMyw0NS41MTEsNS42ODlsNTQuMDQ0LDY5LjY4OWwxMTkuNDY3LTE1NS4wMjINCgljMTEuMzc4LTE0LjIyMiwzMS4yODktMTcuMDY3LDQ1LjUxMS01LjY4OXMxNy4wNjcsMzEuMjg5LDUuNjg5LDQ1LjUxMUwyMjAuNjA0LDM0MS42NTMNCglDMjEzLjQ5MywzNDguNzY0LDIwNC45NiwzNTQuNDUzLDE5NS4wMDQsMzU0LjQ1M3oiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" />
                                {facilityItem}
                            </div>)}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default CipFacilities;