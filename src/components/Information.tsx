import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler, set } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { login, logout } from '@/redux/reducers/auth_reducers';
import { useNavigate } from 'react-router-dom';

import { mainApi } from '@/api/main_api';
import * as apiEndpoints from '@/api/api_endpoints';
// import { getUserInfo } from '@/api/api_endpoints';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import cat from '@/utils/image_link';

interface IInfoInput {
    email: string;
    firstname: string;
    lastname: string;
    date: Date;
    gender: string;
    address: string;
}

type Props = {};

const Information = (props: Props) => {
    const navigate = useNavigate();
    const isLog = useSelector((state: RootState) => state.auth.isLogin);
    const _id = useSelector((state: RootState) => state.auth.id);
    const _idToken = useSelector((state: RootState) => state.auth.customerIdToken);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [avatar, setAvatar] = useState(cat);
    const [gender, setGender] = useState('');

    const { register, formState: { errors }, setError, handleSubmit } = useForm<IInfoInput>();

    const handleChange = (date: Date | null) => {
        if (date !== null) {
            setSelectedDate(date);
          }
	};

    const onSubmit: SubmitHandler<IInfoInput> = async (data) => {

    }

    const fetchInfo = async () => {
        try{
            // const user = getUserInfo(_id);
            const user = await mainApi.get(apiEndpoints.GET_USER_INFO(_id));
            const infor = user.data.data;
            return { ...infor};
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }

    const fetchAvatar = async () => {
        try{
            const img = await mainApi.get(
                apiEndpoints.GET_AVATAR_URL, 
                apiEndpoints.getAccessToken(_idToken));
            const avatar = img.data.data;
            if(avatar !== null)
            setAvatar(avatar);
            console.log('ava', avatar);
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }

    useEffect(() => {
        if(isLog) {
            fetchInfo().then((res) => {
                setEmail(res.customerEmail);
                setFirstName(res.customerFirstName);
                setLastName(res.customerLastName);
                const date = new Date(res.customerBirthday);
                handleChange(date);
                setSelectedDate(date);
                if (res.customerGender === 'Nam') setGender('Male');
                else setGender('Female');
            })
        }
        else if (!isLog) {
            dispatch(logout());
            navigate('/signin')
        }
    }, [isLog]);

    
    return (
    <div className="pl-[5rem] border-l-2 mt-10 flex justify-start lg:justify-center"> 
        {/* Form */}
        <div className="w-[30rem] max-[512px]:w-full">
            <h1 className='flex justify-center text-2xl font-bold text-gray-700 mb-6'>Thông tin tài khoản</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-full mx-auto mt-2">
                {/* Basic information */}
                <div className='flex justify-center'>
                    <div className="mb-1 p-1 pr-2 min-w-fit">
                        <label htmlFor="text" className="font-semibold text-base text-dark-1">Họ:</label>
                        <input type="text" id="lastname" name="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} 
                        className="w-full px-3 py-1 placeholder-gray-400 border border-secondary-1 rounded-sm shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black" required />
                    </div>
                    <div className="mb-1 p-1 pl-2">
                        <label htmlFor="text" className="font-semibold text-base text-dark-1">Tên:</label>
                        <input type="text" id="firstname" name="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                        className="w-full px-3 py-1 placeholder-gray-400 border border-secondary-1 rounded-sm shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black" required />
                    </div>
                </div>

                {/* Date time picker and gender */}
                <div className='flex justify-start'>
                     {/* Date time picker */}
                    <div className="mb-1 pl-1 mr-4">
                        <label htmlFor="email" className="font-semibold text-base text-dark-1">Ngày sinh:</label>
                        <div className=''>
                            <div className='relative'>
                                <DatePicker 
                                selected={selectedDate} 
                                onChange={(date) => handleChange(date)} 
                                className="relative h-8 p-4 border border-secondary-1 rounded-sm shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                >
                                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                        className="w-6 h-6 absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                        </svg> */}
                                </DatePicker>
                            </div>
                        </div>
                    </div>
                    {/* Gender */}
                    <div className="mb-1">
                        <label className="min-w-10 font-semibold text-base text-dark-1">Giới tính:</label>
                        <select 
                        value={gender}
                        className="bg-white border border-secondary-1 text-gray-900 text-sm rounded-sm focus:ring-white focus:border-black focus:border-2 block w-full p-1.5 dark:bg-dark-1 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            {/* <option selected>Giới tính:</option> */}
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                        </select>
                    </div>
                </div>

                {/* Email */}
                <div className="mb-1 p-1">
                    <label htmlFor="email" className="font-semibold text-base text-dark-1">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-3 py-1 placeholder-gray-400 border border-secondary-1 rounded-sm shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black" required />
                </div>

                {/* Default Address */}
                <div className="mb-1 p-1">
                    <label className="font-semibold text-base text-dark-1">Địa chỉ mặc định:</label>
                    <select className="bg-white border border-secondary-1 text-gray-900 text-sm rounded-sm focus:ring-white focus:border-black focus:border-2 block w-full p-1.5 dark:bg-dark-1 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="Male">2</option>
                            <option value="Female">3</option>
                        </select>
                </div>

                <div className='my-8 p-1'>
                    <button type="submit" className="w-full px-3 py-1 text-white bg-primary-1 border rounded-sm border-secondary-1 hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
                        CẬP NHẬT
                    </button>
                </div>
            </form>
        </div>

        {/* Avatar */}
        <div className="pl-10 w-[9rem] h-[9rem]">
            <div className="max-w-full mx-auto mt-2">
                <div className='flex justify-center'>
                    <div className="mb-1 p-1 pr-2">
                        <div className="mt-[4rem]">
                            {/* <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-1 hover:text-primary-2 focus-within:outline-none">
                                <img src={avatar} 
                                alt="avatar" className="object-scale-down shadow rounded-full max-w-full h-auto align-middle border-none" />
                                <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only" 
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                />
                            </label> */}
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-1 hover:text-primary-2 focus-within:outline-none">
                                    <img src={avatar} alt="avatar" className="object-scale-down shadow rounded-full max-w-full h-auto align-middle border-none" />
                                    <input 
                                    id="file-upload" 
                                    name="file-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    onChange={(e) => {
                                        const file = e.target?.files?.[0];
                                        if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setAvatar(event.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                        }
                                    }}
                                    />
                                </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Information;