'use client'
import React, { useEffect, useState } from 'react'
import { Loader2, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/use-toast';
import { deleteUser, getAllUsers, getCurrentUser, promoteUser } from '../../../lib/user';

function Admin() {

    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(true);
    const [curentUser, setCurrentUser] = useState({})

    async function getUsers() {
        try {
            const res = await getAllUsers()
            setLoader(false)
            setUsers(res)
        } catch (error) {
            console.log(error)
        }
    };

    async function dltUser(email) {
        setLoader(true)
        try {
            const res = await deleteUser(email);
            if (res.ok) {
                await getUsers()
                setLoader(false)
                return toast({
                  variant: 'default',
                  title: "User deleted."
                  });
            }else{
              return toast({
                variant: 'destructive',
                title: "Something went wrong"
                });
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function promoteToAdmin(email){
        setLoader(true)
        const res = await promoteUser(email);
        if(res.ok){
            await getUsers();
            setLoader(false)
            return toast({
              variant: 'default',
              title: "Promoted to admin!"
              });
        }else{
          return toast({
            variant: 'destructive',
            title: "Something went wrong"
            });
        }
    };

    async function fetchCurrentUser(){
      const user = await getCurrentUser();
      setCurrentUser(user)
    };

    useEffect(() => {
        getUsers();
       
    }, []);

    
    return (
        <div className='w-full font-Inter p-4'>
            {loader && <div className='w-[80%] justify-center h-screen flex items-center z-50 bg-gray-50 opacity-40 self-start select-none fixed'>
                <Loader2 className='animate-spin m-auto' />
            </div>}
            <h2 className='text-3xl text-strong font-bold flex gap-x-2 items-center '><Users /> Manage Users</h2>
            <hr className='my-5' />
            <Table>
                <TableHeader className='p-2 w-full'>
                    <TableRow className='border-none p-2 hover:bg-transparent'>
                        <TableHead className="text-left">Email</TableHead>
                        <TableHead className='text-center'>Role</TableHead>
                        <TableHead className='text-center'>Change Role</TableHead>
                        <TableHead className="text-center">Delete User</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 && users?.map(user =>
                        <TableRow key={user.id}>
                            <TableCell className='font-[500] text-sm leading-5'>
                                {user?.email}
                            </TableCell>
                            <TableCell className='text-center font-[400] leading-5 text-sm'>
                                {user?.role === "admin" ? "Admin" : "User"}
                            </TableCell >
                            <TableCell className='text-center'>
                                <div>
                                    <Button disabled={user?.id === curentUser?.id} className={`w-[12rem] ${user?.role === "admin" ? "bg-orange-300 hover:bg-orange-400" : "bg-green-400 hover:bg-green-500"}`} onClick={()=> promoteToAdmin(user?.email)}>
                                        {user?.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell className='text-center'>
                                <div>
                                    <Button disabled={user?.id === curentUser?.id} className={`bg-red-400 hover:bg-red-500`} onClick={() => dltUser(user?.email)}>
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>
        </div>
    )
}

export default Admin