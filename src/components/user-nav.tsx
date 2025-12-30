'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/firebase";
import { signOut, type User } from "firebase/auth";
import MigrationDialog from "./migration-dialog";
import { Move } from "lucide-react";

interface UserNavProps {
    user: User;
}

export function UserNav({ user }: UserNavProps) {
    const { auth } = useAuth();
    
    const handleSignOut = () => {
        if (auth) {
            signOut(auth).catch(console.error);
        }
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
            <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground pt-1">
              <span className="font-semibold">UID:</span> {user.uid}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
          <MigrationDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Move className="mr-2 h-4 w-4" />
                <span>Data Migration</span>
            </DropdownMenuItem>
          </MigrationDialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
