// import { Formik, Form, Field } from 'formik';
// import { i18n, useTranslation } from 'next-i18next';

// import Button from '@/modules/shared/components/ui/Button';
// import { validateRequied, validateEmail } from '@/modules/shared/helpers/validation';
// import { insertComment } from '@/modules/domesticHotel/actions';

// type Props = {
//     pageId: number
// }

// const CommentForm: React.FC<Props> = props => {

//     const { t } = useTranslation('common');
//     const { t: tHotel } = useTranslation('hotel');

//     type FormValues = {
//         FullName: string;
//         CityName: string;
//         Email: string;
//         Comment: string;
//         Satisfaction: string;
//         RoomService: string;
//         ResturantQuality: string;
//         DealWithPassanger: string;
//         IsRecommended: boolean;
//     }
//     const initialValues: FormValues = {
//         FullName: '',
//         CityName: '',
//         Email: '',
//         Comment: '',
//         Satisfaction: '',
//         RoomService: '',
//         ResturantQuality: '',
//         DealWithPassanger: '',
//         IsRecommended: false
//     };

//     const numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//     const submitHandle = async (values: FormValues, actions: any) => {

//         const params = {
//             PageId: props.pageId,
//             FullName: values.FullName,
//             CityName: values.CityName,
//             Email: values.Email,
//             Comment: values.Comment,
//             IsRecommended: values.IsRecommended || false,
//             Satisfaction: +values.Satisfaction,
//             RoomService: +values.RoomService,
//             ResturantQuality: +values.ResturantQuality,
//             DealWithPassanger: +values.DealWithPassanger
//         };

//         actions.resetForm();

//         const response : any = await insertComment(params, i18n?.language === 'en'?"en-US":"fa-IR");

//         if (response?.data?.result) {
//             debugger;
//             //toDo
//         }

//     }

//     return (
//         <div className='p-3 sm:p-5 lg:p-7 bg-white rounded-xl grid grid-cols-1 md:grid-cols-3 md:gap-6'>
//             <div>
//                 <h5 className='text-sm md:text-base font-semibold mb-5'>{tHotel("submit-suggestion")}</h5>
//             </div>

//             <div className='md:col-span-2'>
//                 <Formik
//                      validate={() => { return {} }}
//                     initialValues={initialValues}
//                     onSubmit={submitHandle}
//                 >
//                     {({ errors, touched, isValid, isSubmitting }) => {
//                         if (isSubmitting && !isValid) {

//                             setTimeout(() => {
//                                 const formFirstError = document.querySelector(".has-validation-error");
//                                 if (formFirstError) {
//                                     formFirstError.scrollIntoView({ behavior: "smooth" });
//                                 }
//                             }, 100)

//                         }
//                         return (
//                             <Form className='leading-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 text-xs sm:text-sm'>

//                                 <div className={`sm:col-span-2 lg:col-span-4 ${errors.FullName ? "has-validation-error" : ""}`}>
//                                     <label htmlFor="FullName" className='block mb-1' > <span className='text-red-500'>*</span> {t('full-name')}</label>
//                                     <Field
//                                         validate={(value: string) => validateRequied(value, t('please-enter-name'))}
//                                         id="FullName"
//                                         name="FullName"
//                                         className={`h-10 px-5 border ${errors.FullName && touched.FullName ? "border-red-500" : "border-neutral-300"} outline-none rounded-md w-full`}
//                                     />
//                                     {errors.FullName && touched.FullName && <div className='text-red-500 text-xs'>{errors.FullName as string}</div>}

//                                 </div>

//                                 <div className='lg:col-span-4'>
//                                     <label htmlFor="CityName" className='block mb-1' > {tHotel('from-city')} </label>
//                                     <Field
//                                         id="CityName"
//                                         name="CityName"
//                                         className="h-10 px-5 border border-neutral-300 outline-none rounded-md w-full"
//                                     />
//                                 </div>

//                                 <div className={`lg:col-span-4 ${errors.Email ? "has-validation-error" : ""}`}>
//                                     <label htmlFor="Email" className='block mb-1' > <span className='text-red-500'>*</span> {t('email')} </label>
//                                     <Field
//                                         validate={(value: string) => validateEmail({value:value,reqiredMessage: t('enter-email-address'),invalidMessage: t('invalid-email')})}
//                                         id="Email"
//                                         name="Email"
//                                         className={`h-10 px-5 border ${errors.Email && touched.Email ? "border-red-500" : "border-neutral-300"} outline-none rounded-md w-full`}
//                                     />
//                                     {errors.Email && touched.Email && <div className='text-red-500 text-xs'>{errors.Email as string}</div>}
//                                 </div>

//                                 <div className='sm:col-span-2 lg:col-span-12'>

//                                     <label htmlFor="Comment" className='block mb-1' > {tHotel('suggestion-text')} </label>
//                                     <Field
//                                         as="textarea"
//                                         id="Comment"
//                                         name="Comment"
//                                         className="h-20 px-5 border border-neutral-300 outline-none rounded-md w-full"
//                                     />

//                                 </div>

//                                 <div className='lg:col-span-3'>
//                                     <label htmlFor="Satisfaction" className='md:text-xs block mb-1' > {tHotel('satisfaction-percentage')} </label>
//                                     <Field
//                                         as="select"
//                                         id="Satisfaction"
//                                         name="Satisfaction"
//                                         className="h-10 px-5 border border-neutral-300 outline-none rounded-md w-full"
//                                     >
//                                         {numbersArray.map(item => <option key={item} value={item * 10}>{item * 10}</option>)}
//                                     </Field>
//                                 </div>

//                                 <div className='lg:col-span-3'>
//                                     <label htmlFor="RoomService" className='md:text-xs block mb-1' > {tHotel('room-status')} </label>
//                                     <Field
//                                         as="select"
//                                         id="RoomService"
//                                         name="RoomService"
//                                         className="h-10 px-5 border border-neutral-300 outline-none rounded-md w-full"
//                                     >
//                                         {numbersArray.map(item => <option key={item} value={item}>{item}</option>)}
//                                     </Field>
//                                 </div>

//                                 <div className='lg:col-span-3'>
//                                     <label htmlFor="ResturantQuality" className='md:text-xs block mb-1' > {tHotel('restaurant-quality')} </label>
//                                     <Field
//                                         as="select"
//                                         id="ResturantQuality"
//                                         name="ResturantQuality"
//                                         className="h-10 px-5 border border-neutral-300 outline-none rounded-md w-full"
//                                     >
//                                         {numbersArray.map(item => <option key={item} value={item}>{item}</option>)}
//                                     </Field>
//                                 </div>

//                                 <div className='lg:col-span-3'>
//                                     <label htmlFor="DealWithPassanger" className='md:text-xs block mb-1' > {tHotel('employees-treatment')} </label>
//                                     <Field
//                                         as="select"
//                                         id="DealWithPassanger"
//                                         name="DealWithPassanger"
//                                         className="h-10 px-5 border border-neutral-300 outline-none rounded-md w-full"
//                                     >
//                                         {numbersArray.map(item => <option key={item} value={item}>{item}</option>)}
//                                     </Field>
//                                 </div>

//                                 <div className='sm:col-span-2 lg:col-span-12'>
//                                     <label>
//                                         <Field type="checkbox" name="IsRecommended" className="inline-block align-middle" /> {tHotel('suggest-to-other')}
//                                     </label>

//                                 </div>

//                                 <div className='sm:col-span-2 lg:col-span-12'>
//                                     <Button
//                                         type='submit'
//                                         className='h-10 px-5 rounded-md max-w-full sm:w-32'
//                                     >
//                                         {t('send')}
//                                     </Button>
//                                 </div>

//                             </Form>
//                         )
//                     }}
//                 </Formik>

//             </div>


//         </div>
//     )
// }

// export default CommentForm;