import { Outlet } from 'react-router-dom';
import { SidebarProvider, SubMenuProvider } from './ui/sidebar';

const MainLayout = () => {
  return (
    <SidebarProvider>
      <SubMenuProvider>
        <Outlet />
      </SubMenuProvider>
    </SidebarProvider>
  );
};

export default MainLayout;
