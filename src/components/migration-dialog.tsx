'use client';

import { useState, type ReactNode } from 'react';
import {
  collection,
  doc,
  getDocs,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

async function moveSubcollections(
  db: Firestore,
  batch: import('firebase/firestore').WriteBatch,
  fromPath: string,
  toPath: string
) {
  const subcollections = ['budgets', 'earned', 'expenses'];
  for (const subcollection of subcollections) {
    const fromSubcollectionRef = collection(db, `${fromPath}/${subcollection}`);
    const fromSnapshot = await getDocs(fromSubcollectionRef);
    if (!fromSnapshot.empty) {
        console.log(`Found ${fromSnapshot.size} docs in ${subcollection} for ${fromPath}`);
    }
    fromSnapshot.forEach((docSnapshot) => {
      const fromDocRef = docSnapshot.ref;
      const toDocRef = doc(db, `${toPath}/${subcollection}`, docSnapshot.id);
      batch.set(toDocRef, docSnapshot.data());
      batch.delete(fromDocRef);
    });
  }
}

export default function MigrationDialog({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fromUserId, setFromUserId] = useState('');
  const [toUserId, setToUserId] = useState('');
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMigrateData = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available.',
      });
      return;
    }
    if (!fromUserId || !toUserId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide both "From" and "To" user IDs.',
      });
      return;
    }
    if (fromUserId === toUserId) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Source and destination user IDs cannot be the same.',
        });
        return;
      }

    toast({ title: 'Migration Started', description: 'Please wait...' });

    try {
      const fromUserRef = doc(firestore, 'users', fromUserId);
      const fromMonthsRef = collection(fromUserRef, 'months');
      const fromMonthsSnapshot = await getDocs(fromMonthsRef);
      const toUserRef = doc(firestore, 'users', toUserId);
      
      if (fromMonthsSnapshot.empty) {
        toast({
          variant: 'destructive',
          title: 'No Data',
          description: `No 'months' subcollection found for user ${fromUserId}. If the user exists but has no data, this is expected.`,
        });
        // Even if no months, we should delete the source user doc
        const batch = writeBatch(firestore);
        batch.delete(fromUserRef);
        await batch.commit();
        toast({
            title: 'Source User Deleted',
            description: `Source user ${fromUserId} had no data and has been deleted.`,
        });
        setIsOpen(false);
        return;
      }

      const batch = writeBatch(firestore);

      // Ensure destination user doc exists for security rules, etc.
      batch.set(toUserRef, { migratedFrom: fromUserId }, { merge: true });

      for (const monthDoc of fromMonthsSnapshot.docs) {
        const fromMonthRef = monthDoc.ref;
        const toMonthRef = doc(toUserRef, 'months', monthDoc.id);

        // Move the month document data itself
        batch.set(toMonthRef, monthDoc.data());

        // Move subcollections for each month
        await moveSubcollections(
          firestore,
          batch,
          fromMonthRef.path,
          toMonthRef.path
        );
        
        // Finally, delete the month document itself from the source
        batch.delete(fromMonthRef);
      }
      
      // Delete the source user document after all subcollections are handled
      batch.delete(fromUserRef);

      await batch.commit();

      toast({
        title: 'Migration Successful',
        description: `Data moved from ${fromUserId} to ${toUserId}.`,
      });
      setIsOpen(false);
      setFromUserId('');
      setToUserId('');
    } catch (error: any) {
      console.error('Migration failed:', error);
      toast({
        variant: 'destructive',
        title: 'Migration Failed',
        description: error.message || 'An unknown error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move User Data</DialogTitle>
          <DialogDescription>
            Move all data from one user account to another. This action is
            irreversible.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="from-user" className="text-right">
              From
            </Label>
            <Input
              id="from-user"
              value={fromUserId}
              onChange={(e) => setFromUserId(e.target.value)}
              placeholder="Source User ID"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to-user" className="text-right">
              To
            </Label>
            <Input
              id="to-user"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              placeholder="Destination User ID"
              className="col-span-3"
            />
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                This action will permanently move all data from the source user to the destination user, deleting the source user's data. This cannot be undone.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
          <Button onClick={handleMigrateData} variant="destructive">Move Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}