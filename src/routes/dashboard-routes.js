import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import SettingsIcon from '@material-ui/icons/Settings';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
// import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpIcon from '@material-ui/icons/Help';
import MenuBookIcon from '@material-ui/icons/MenuBook';

import DashboardPage from "../pages/dashboard/Dashboard";
import APIKey from "../pages/dashboard/APIKey";
import Bank from "../pages/dashboard/Bank";
import CoinSetting from "../pages/dashboard/CoinSetting";
import DeveloperGuide from "../pages/dashboard/DeveloperGuide";
import Invoice from "../pages/dashboard/Invoice";
import Support from "../pages/dashboard/Support";
import Transaction from "../pages/dashboard/Transaction";
// import Transfer from "../pages/dashboard/Transfer";
import UserProfile from "../pages/dashboard/UserProfile";
import Wallet from "../pages/dashboard/Wallet";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/dashboard"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/dashboard"
  },
  {
    path: "/bank",
    name: "Bank",
    icon: AccountBalanceIcon,
    component: Bank,
    layout: "/dashboard"
  },
  {
    path: "/invoice",
    name: "Invoice",
    icon: LibraryBooks,
    component: Invoice,
    layout: "/dashboard"
  },
  {
    path: "/wallet",
    name: "Wallet",
    icon: AccountBalanceWalletIcon,
    component: Wallet,
    layout: "/dashboard"
  },
  {
    path: "/coin-setting",
    name: "Coin Setting",
    icon: SettingsIcon,
    component: CoinSetting,
    layout: "/dashboard"
  },
  {
    path: "/transaction",
    name: "Transaction",
    icon: SyncAltIcon,
    component: Transaction,
    layout: "/dashboard"
  },
  // {
  //   path: "/transfer",
  //   name: "Transfer",
  //   icon: TransferWithinAStationIcon,
  //   component: Transfer,
  //   layout: "/dashboard"
  // },
  {
    path: "/api-key",
    name: "API Key",
    icon: VpnKeyIcon,
    component: APIKey,
    layout: "/dashboard"
  },
  {
    path: "/docs",
    name: "Developer Guide",
    icon: MenuBookIcon,
    component: DeveloperGuide,
    layout: "/dashboard"
  },
  {
    path: "/support",
    name: "Support",
    icon: HelpIcon,
    component: Support,
    layout: "/dashboard"
  },
  // {
  //   path: "/logout",
  //   name: "Logout",
  //   icon: ExitToAppIcon,
  //   component: Logout,
  //   layout: "/dashboard"
  // }
];

export default dashboardRoutes;
