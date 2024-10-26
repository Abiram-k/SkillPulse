import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogDemo() {
  return (
    <Dialog className="mt-5">
      <DialogTrigger asChild>
        <Button variant="outline" className="font-mono">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-mono">Edit profile</DialogTitle>
          <DialogDescription className="font-mono">
            You can change password here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 font-mono">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Current Password
            </Label>
            <Input
              id="name"
              defaultValue="Current Password"
              className="col-span-3 text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>
            <Input
              id="username"
              defaultValue="Password"
              className="col-span-3 text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="username"
              defaultValue=" Confirm Password"
              className="col-span-3 text-black"
            />
          </div>
        </div>
        <DialogFooter className={" font-mono font-bold"}>
          <Button type="submit" className={"bg-gray-500"}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
