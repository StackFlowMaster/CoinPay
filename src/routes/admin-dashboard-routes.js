import Person from "@material-ui/icons/Person";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import SettingsIcon from '@material-ui/icons/Settings';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpIcon from '@material-ui/icons/Help';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import App from "../pages/admin/App";
import Bank from "../pages/admin/Bank";
import Coin from "../pages/admin/Coin";
import Invoice from "../pages/admin/Invoice";
import Logout from "../pages/dashboard/Logout";
import Support from "../pages/admin/Support";
import Transaction from "../pages/admin/Transaction";
import User from "../pages/admin/User";
import Wallet from "../pages/admin/Wallet";

const AdminDashboardRoutes = [
  {
    path: "/users",
    name: "Users",
    icon: Person,
    component: User,
    layout: "/admin/dashboard"
  },
  {
    path: "/banks",
    name: "Banks",
    icon: AccountBalanceIcon,
    component: Bank,
    layout: "/admin/dashboard"
  },
  {
    path: "/invoices",
    name: "Invoices",
    icon: LibraryBooks,
    component: Invoice,
    layout: "/admin/dashboard"
  },
  {
    path: "/wallets",
    name: "Wallets",
    icon: AccountBalanceWalletIcon,
    component: Wallet,
    layout: "/admin/dashboard"
  },
  {
    path: "/coins",
    name: "Coins",
    icon: SettingsIcon,
    component: Coin,
    layout: "/admin/dashboard"
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: SyncAltIcon,
    component: Transaction,
    layout: "/admin/dashboard"
  },
  {
    path: "/apps",
    name: "Apps",
    icon: VpnKeyIcon,
    component: App,
    layout: "/admin/dashboard"
  },
  {
    path: "/support",
    name: "Support",
    icon: HelpIcon,
    component: Support,
    layout: "/admin/dashboard"
  }
];

export default AdminDashboardRoutes;
