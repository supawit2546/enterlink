"use client"; // บอกว่า component นี้ต้องรันบนฝั่ง client
import React from "react";
import Pricecontainer from "../component/price";
import { Navigation } from "../component/navigation";
export default function Price() {
  return (
    <>
    <Navigation/>
   <Pricecontainer/>
   </>
  );
}
