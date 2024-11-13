"use client"
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter();
  
  router.push("/recipes");

  return (
 <></>
  );
}
