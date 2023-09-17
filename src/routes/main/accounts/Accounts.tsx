import { Outlet } from "react-router-dom";

export default function AccountsLayout(): JSX.Element {
   return (
      <>
         <div>Rendered when visiting '/main/accounts'</div>
            <Outlet />
      </>
   );
}
