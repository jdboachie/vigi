'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { isValidConnection } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database } from '@phosphor-icons/react';
import { useSettings } from "./settings-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePostgresConnectionString } from "@/lib/utils";


// const CredentialsFormSchema = z.object({
//   user: z.string().min(1, { message: "User is required." }),
//   password: z.string().min(1, { message: "Password is required." }),
//   host: z.string().min(1, { message: "Host is required." }),
//   port: z.number().int().min(1, { message: "Port is required." }).max(65535, { message: "Port must be between 1 and 65535." }),
//   database: z.string().min(1, { message: "Database is required." }),
// });

const ConnectionStringFormSchema = z.object({
  connectionString: z.string().min(1, { message: "Connection string is required." }),
})

function ConnectionStringForm() {
  const { settings, setSettings } = useSettings();
  const form = useForm<z.infer<typeof ConnectionStringFormSchema>>({
    resolver: zodResolver(ConnectionStringFormSchema),
    defaultValues: settings,
  });

  async function onSubmit(data: z.infer<typeof ConnectionStringFormSchema>) {
    const { username, password, host, port, database, ssl } = parsePostgresConnectionString(data.connectionString);
    setSettings({ user: username, password, host, port, database, ssl, connectionString: data.connectionString});

    const {res, message} = await isValidConnection(settings)

    if (res) {
      toast.success(
        "Settings updated",
        {
          description: (
            'New database settings have been applied successfully.'
          ),
        }
      );
    } else {
      toast.error(
        "Error connecting to database",
        {
          description: (message)
        }
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-flow-row gap-2 px-6">
          <FormField
            control={form.control}
            name="connectionString"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection String</FormLabel>
                <FormControl>
                  <Input spellCheck={false} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="col-span-2">
          <DialogClose asChild>
            <Button size={'default'} variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size={'default'} type="submit">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );

}

// function CredentialsForm() {
//   const { settings, setSettings } = useSettings();
//   const form = useForm<z.infer<typeof CredentialsFormSchema>>({
//     resolver: zodResolver(CredentialsFormSchema),
//     defaultValues: settings,
//   });

//   function onSubmit(data: z.infer<typeof CredentialsFormSchema>) {
//     setSettings(data);
//     toast.success(
//       "Settings updated",
//       {
  //         description: (
//           'New database settings have been applied successfully.'
//         ),
//       }
//     );
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="">
//         <div className="grid grid-flow-row gap-2 px-6">
//           <FormField
//             control={form.control}
//             name="user"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>User</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-2 gap-2">

//           <FormField
//             control={form.control}
//             name="host"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Host</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="port"
//             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Port</FormLabel>
  //                 <FormControl>
  //                   <Input type="number" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//             />
//           </div>
//           <FormField
//             control={form.control}
//             name="database"
//             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Database</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <DialogFooter className="col-span-2">
//           <DialogClose asChild>
//             <Button size={'default'} variant="outline">Cancel</Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button size={'default'} type="submit">Save changes</Button>
//           </DialogClose>
//         </DialogFooter>
//       </form>
//     </Form>
//   );
// }

// Main Component

export function SettingsView() {
  const { settings } = useSettings()
  return (
    <Dialog>
      <DialogTrigger asChild>
          <Button variant={'secondary'}><Database size={16} className='mr-2' />{settings.database} / {settings.user}@{settings.host} <div className='size-3 animate-pulse rounded-full bg-green-500 ml-2' /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Database Settings</DialogTitle>
          <DialogDescription>
            Make changes to your database connection here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* <CredentialsForm /> */}
        <ConnectionStringForm />
      </DialogContent>
    </Dialog>
  );
}
