"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Home() {
  function handleClick() {
    console.log("Button clicked");
  }

  const handleClick2 = () => {
    console.log("Button clicked");
  }


  return (
    <>
    <div>
      <h1>Hello World</h1>
      <Button variant="outline" onClick={handleClick2}>Button</Button>
      <Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
    </>

    
  );
}
