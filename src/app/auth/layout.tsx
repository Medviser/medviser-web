export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>){
     return (
          <div className="bg-linear-to-br from-primary to-background w-full h-dvh flex justify-center items-center">
               {children}
          </div>
     )
}