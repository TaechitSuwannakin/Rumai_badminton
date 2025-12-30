import { configureStore } from '@reduxjs/toolkit';
import racketReducer from '../features/racket/racketSlice';

export const store = configureStore({ //คำสั่ง Redux Toolkit เพื่อสร้าง Store ขึ้นมาใช้เก็บข้อมูลต่างๆ
  reducer: { //แบ่งแผนกในโกดัง
    racket: racketReducer, //ตัวนี้บอกว่าถ้าใครจะติดต่อแผนก racket ให้ไปใช้ตรรกะการทำงานจาก racketSlice 
  },
});

export type RootState = ReturnType<typeof store.getState>; //ประเภทของข้อมูลทั้งหมดที่เก็บใน Store
export type AppDispatch = typeof store.dispatch; //ประเภทของคำสั่ง (Action) ที่สามารถส่งไปยัง Store ได้