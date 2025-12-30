import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store'; 

//Redux Toolkit กับ TypeScript
export const useAppDispatch = useDispatch.withTypes<AppDispatch>(); //ใช้สำหรับส่งคำสั่ง (Action) ไปยัง Store เพื่อเปลี่ยนแปลงข้อมูล
export const useAppSelector = useSelector.withTypes<RootState>(); //ใช้สำหรับดึงข้อมูล (State) จาก Store ออกมาโชว์ที่หน้าเว็บ