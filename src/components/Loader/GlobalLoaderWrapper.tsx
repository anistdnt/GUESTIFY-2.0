// components/GlobalLoaderWrapper.tsx
'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loading from "./Loading";


const GlobalLoaderWrapper = () => {
  const isLoading = useSelector((state:RootState) => state.loader_slice.isLoading);

  return isLoading ? <Loading /> : null;
};

export default GlobalLoaderWrapper;
